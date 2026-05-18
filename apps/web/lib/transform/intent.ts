import {
  imageGenerationPatterns,
  promptRequestPatterns,
  USE_CASE_PATTERN_DEFINITIONS
} from "@/lib/transform/intent-patterns";
import {
  getDefaultSubcase,
  getSubcaseOptions,
  isUseCasePrimary,
  type UseCasePrimary
} from "@/lib/transform/use-cases";

type TransformIntentInput = {
  rawPrompt: string;
  useCasePrimary?: UseCasePrimary | null;
  useCaseSecondary?: string | null;
  attachmentKinds?: readonly ("text" | "pdf" | "image")[];
};

export type TransformIntent = {
  effectiveUseCasePrimary: UseCasePrimary | null | undefined;
  effectiveUseCaseSecondary: string | null | undefined;
  imagePromptOptimizationActive: boolean;
  imagePromptOptimizationReason: string;
  useCaseInferred: boolean;
  useCaseInferenceReason: string;
  explicitImageSelection: boolean;
};

const MIN_INFERENCE_SCORE = 2;
const SUBCASE_OVERRIDE_DELTA = 1;

type ScoredMatch = {
  primary: UseCasePrimary;
  secondary: string;
  score: number;
  signals: string[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAny(patterns: readonly RegExp[], value: string) {
  return patterns.some((pattern) => pattern.test(value));
}

function scorePatterns(patterns: readonly RegExp[], value: string, label: string, weight = 1) {
  const hits = patterns.filter((pattern) => pattern.test(value));
  if (hits.length === 0) {
    return { score: 0, signals: [] as string[] };
  }

  return {
    score: hits.length * weight,
    signals: [`${label} (${hits.length})`]
  };
}

function scoreAttachmentBoost(
  primary: UseCasePrimary,
  attachmentKinds: readonly ("text" | "pdf" | "image")[]
) {
  if (attachmentKinds.length === 0) {
    return { score: 0, signals: [] as string[] };
  }

  const hasTextLike = attachmentKinds.some((kind) => kind === "text" || kind === "pdf");
  const hasImage = attachmentKinds.includes("image");

  if (primary === "image" && hasImage) {
    return { score: 3, signals: ["attached images"] };
  }

  if (primary === "documents" && hasTextLike) {
    return { score: 2, signals: ["attached documents"] };
  }

  if ((primary === "research" || primary === "text") && hasTextLike) {
    return { score: 1, signals: ["attached source files"] };
  }

  return { score: 0, signals: [] as string[] };
}

function scoreUseCaseMatches(
  normalizedPrompt: string,
  attachmentKinds: readonly ("text" | "pdf" | "image")[]
): ScoredMatch[] {
  const matches: ScoredMatch[] = [];

  for (const definition of USE_CASE_PATTERN_DEFINITIONS) {
    const primaryResult = scorePatterns(definition.primaryPatterns, normalizedPrompt, definition.primary, 2);
    const attachmentResult = scoreAttachmentBoost(definition.primary, attachmentKinds);

    for (const subcase of definition.subcases) {
      const subcaseResult = scorePatterns(subcase.patterns, normalizedPrompt, subcase.id, 3);
      const totalScore = primaryResult.score + subcaseResult.score + attachmentResult.score;

      if (totalScore <= 0) {
        continue;
      }

      matches.push({
        primary: definition.primary,
        secondary: subcase.id,
        score: totalScore,
        signals: [...primaryResult.signals, ...subcaseResult.signals, ...attachmentResult.signals]
      });
    }
  }

  return matches.sort((left, right) => right.score - left.score);
}

function pickBestMatch(matches: ScoredMatch[]) {
  return matches[0] ?? null;
}

function resolveSubcaseForPrimary(
  primary: UseCasePrimary,
  normalizedPrompt: string,
  selectedSecondary?: string | null
) {
  const matches = scoreUseCaseMatches(normalizedPrompt, []).filter((match) => match.primary === primary);
  const best = pickBestMatch(matches);

  if (!best || best.score < MIN_INFERENCE_SCORE) {
    const fallback =
      selectedSecondary && getSubcaseOptions(primary).some((subcase) => subcase.id === selectedSecondary)
        ? selectedSecondary
        : getDefaultSubcase(primary);

    return {
      secondary: fallback,
      inferred: false,
      reason: selectedSecondary
        ? "Using the user-selected subcase."
        : `Defaulted to ${fallback} for the selected primary use case.`
    };
  }

  const selectedIsValid =
    selectedSecondary && getSubcaseOptions(primary).some((subcase) => subcase.id === selectedSecondary);
  const selectedMatch = selectedIsValid
    ? matches.find((match) => match.secondary === selectedSecondary)
    : null;

  if (selectedMatch && best.score - selectedMatch.score < SUBCASE_OVERRIDE_DELTA) {
    return {
      secondary: selectedSecondary!,
      inferred: false,
      reason: "Using the user-selected subcase."
    };
  }

  return {
    secondary: best.secondary,
    inferred: true,
    reason: `Inferred subcase "${best.secondary}" from prompt signals: ${best.signals.join(", ")}.`
  };
}

function shouldActivateImageOptimization({
  normalizedPrompt,
  effectivePrimary,
  explicitImageSelection
}: {
  normalizedPrompt: string;
  effectivePrimary: UseCasePrimary;
  explicitImageSelection: boolean;
}) {
  if (explicitImageSelection || effectivePrimary === "image") {
    return {
      active: true,
      reason: explicitImageSelection
        ? "Image filter explicitly selected by the user."
        : "Image use case is active for this transformation."
    };
  }

  const asksForPrompt = matchesAny(promptRequestPatterns, normalizedPrompt);
  const requestsImageGeneration = matchesAny(imageGenerationPatterns, normalizedPrompt);
  const imageDefinition = USE_CASE_PATTERN_DEFINITIONS.find((definition) => definition.primary === "image");
  const referencesImageArtifact = imageDefinition
    ? matchesAny(imageDefinition.primaryPatterns, normalizedPrompt)
    : false;

  if (referencesImageArtifact && (asksForPrompt || requestsImageGeneration)) {
    const detectedSignals = [
      asksForPrompt ? "prompt wording requested" : null,
      referencesImageArtifact ? "image artifact referenced" : null,
      requestsImageGeneration ? "image generation action referenced" : null
    ].filter(Boolean);

    return {
      active: true,
      reason: `Auto-switched to image prompting because ${detectedSignals.join(", ")}.`
    };
  }

  return {
    active: false,
    reason: "No strong image-prompt intent detected."
  };
}

export function resolveTransformIntent({
  rawPrompt,
  useCasePrimary,
  useCaseSecondary,
  attachmentKinds = []
}: TransformIntentInput): TransformIntent {
  const normalizedPrompt = normalizeText(rawPrompt);
  const explicitImageSelection = useCasePrimary === "image";
  const hasExplicitPrimary = Boolean(useCasePrimary && isUseCasePrimary(useCasePrimary));

  if (hasExplicitPrimary) {
    const primary = useCasePrimary as UseCasePrimary;
    const subcaseResolution = resolveSubcaseForPrimary(primary, normalizedPrompt, useCaseSecondary);
    const imageState = shouldActivateImageOptimization({
      normalizedPrompt,
      effectivePrimary: primary,
      explicitImageSelection
    });

    if (imageState.active && !explicitImageSelection) {
      const imageMatches = scoreUseCaseMatches(normalizedPrompt, attachmentKinds).filter(
        (match) => match.primary === "image"
      );
      const bestImageMatch = pickBestMatch(imageMatches);

      return {
        effectiveUseCasePrimary: "image",
        effectiveUseCaseSecondary: bestImageMatch?.secondary ?? "general-image",
        imagePromptOptimizationActive: true,
        imagePromptOptimizationReason: imageState.reason,
        useCaseInferred: true,
        useCaseInferenceReason: bestImageMatch
          ? `Overrode the selected ${primary} filter because image intent was stronger (${bestImageMatch.signals.join(", ")}).`
          : imageState.reason,
        explicitImageSelection: false
      };
    }

    return {
      effectiveUseCasePrimary: primary,
      effectiveUseCaseSecondary: subcaseResolution.secondary,
      imagePromptOptimizationActive: imageState.active,
      imagePromptOptimizationReason: imageState.reason,
      useCaseInferred: subcaseResolution.inferred,
      useCaseInferenceReason: subcaseResolution.reason,
      explicitImageSelection
    };
  }

  const matches = scoreUseCaseMatches(normalizedPrompt, attachmentKinds);
  const best = pickBestMatch(matches);

  if (!best || best.score < MIN_INFERENCE_SCORE) {
    const imageState = shouldActivateImageOptimization({
      normalizedPrompt,
      effectivePrimary: "other",
      explicitImageSelection: false
    });

    return {
      effectiveUseCasePrimary: useCasePrimary,
      effectiveUseCaseSecondary: useCaseSecondary,
      imagePromptOptimizationActive: imageState.active,
      imagePromptOptimizationReason: imageState.reason,
      useCaseInferred: false,
      useCaseInferenceReason: "No confident use-case match; keeping the UI selection or Other > General fallback.",
      explicitImageSelection: false
    };
  }

  const imageState = shouldActivateImageOptimization({
    normalizedPrompt,
    effectivePrimary: best.primary,
    explicitImageSelection: false
  });

  const effectivePrimary =
    imageState.active && best.primary !== "image" && matches.some((match) => match.primary === "image")
      ? "image"
      : best.primary;

  const effectiveMatch =
    effectivePrimary === best.primary
      ? best
      : (matches.find((match) => match.primary === effectivePrimary) ?? best);

  return {
    effectiveUseCasePrimary: effectivePrimary,
    effectiveUseCaseSecondary: effectiveMatch.secondary,
    imagePromptOptimizationActive: imageState.active,
    imagePromptOptimizationReason: imageState.reason,
    useCaseInferred: true,
    useCaseInferenceReason: `Inferred ${effectivePrimary} > ${effectiveMatch.secondary} from prompt signals: ${effectiveMatch.signals.join(", ")}.`,
    explicitImageSelection: false
  };
}
