import type { TargetModel } from "@/lib/transform/schemas";
import {
  normalizeUseCaseSelection,
  subcaseRules,
  useCaseRules,
  type UseCasePrimary
} from "@/lib/transform/use-cases";

export const baseTransformationRules = [
  "You are a prompt transformer. Never answer the user's question or execute their task. Transform their input into a prompt that instructs the destination model to perform the task.",
  "Preserve the user's real intent while upgrading shorthand, fragments, or dictated thoughts into clean instructions.",
  "Default to a single paste-ready execution prompt unless the user clearly wants a reusable assistant or agent setup.",
  "Use XML sections when structural separation improves reliability, especially for reusable assistant or agent packages.",
  "Add examples, assumptions, or guardrails only when they materially improve reliability.",
  "Do not use emojis or decorative symbols anywhere in the transformed prompt. Use plain text, numbered steps, XML tags, or clean section headings as the only structural tools."
] as const;

export const modelSpecificRules: Record<TargetModel, readonly string[]> = {
  claude: [
    "Optimize the transformed prompt for Claude.",
    "Lean into XML organization, explicit constraints, and clean role/task separation.",
    "Favor precise instructions, durable behavioral rules, and transparent success criteria."
  ],
  gemini: [
    "Optimize the transformed prompt for Gemini.",
    "Keep the prompt highly structured, but slightly lighter and more direct.",
    "Emphasize clarity, multimodal readiness, and fast comprehension without losing rigor."
  ],
  chatgpt: [
    "Optimize the transformed prompt for ChatGPT.",
    "Use direct task framing, explicit output contracts, and highly actionable instructions.",
    "Keep the prompt easy to paste into a conversational workflow without losing operational precision."
  ],
  grok: [
    "Optimize the transformed prompt for Grok.",
    "Preserve a stable instruction prefix and keep durable guidance front-loaded.",
    "Bias toward crisp, execution-oriented wording with explicit response structure."
  ],
  mistral: [
    "Optimize the transformed prompt for Mistral.",
    "Prefer compact high-signal instructions, schema-first output contracts, and minimal verbosity.",
    "Use examples selectively and keep constraints explicit."
  ],
  perplexity: [
    "Optimize the transformed prompt for Perplexity.",
    "Emphasize research scoping, grounded synthesis, and output structures that separate conclusions from source handling.",
    "Avoid wording that asks the model to fabricate links or citations when the platform supplies them separately."
  ]
};

export const referenceApplicationRules: Record<TargetModel, readonly string[]> = {
  claude: [
    "Apply the Anthropic reference almost literally.",
    "Preserve XML-style structure, explicit boundaries, and careful constraint phrasing."
  ],
  gemini: [
    "Use the Anthropic reference as the structural baseline, then retune it for Gemini.",
    "Flatten unnecessary nesting when speed improves comprehension while keeping constraints explicit."
  ],
  chatgpt: [
    "Use the Anthropic reference as the reliability baseline, then adapt it for ChatGPT.",
    "Convert the reference into a more direct, execution-oriented instruction style."
  ],
  grok: [
    "Use the Anthropic reference as the reliability baseline, then adapt it for Grok.",
    "Preserve durable structure while keeping the reusable instruction prefix stable and front-loaded."
  ],
  mistral: [
    "Use the Anthropic reference as the reliability baseline, then adapt it for Mistral.",
    "Compress non-essential prose and favor explicit schemas, keys, and constraints."
  ],
  perplexity: [
    "Use the Anthropic reference as the reliability baseline, then adapt it for Perplexity.",
    "Retune the prompt for grounded research flows, evidence-aware synthesis, and separate source handling."
  ]
};

function formatRuleBlock(rules: readonly string[]) {
  return rules.map((rule) => `- ${rule}`).join("\n");
}

export function compileTransformationContext({
  targetModel,
  useCasePrimary,
  useCaseSecondary
}: {
  targetModel: TargetModel;
  useCasePrimary?: UseCasePrimary | null;
  useCaseSecondary?: string | null;
}) {
  const normalizedUseCase = normalizeUseCaseSelection(useCasePrimary, useCaseSecondary);

  return {
    normalizedUseCase,
    baseRules: formatRuleBlock(baseTransformationRules),
    modelRules: formatRuleBlock(modelSpecificRules[targetModel]),
    referenceApplication: formatRuleBlock(referenceApplicationRules[targetModel]),
    useCaseRules: formatRuleBlock(useCaseRules[normalizedUseCase.primary]),
    subcaseRules: formatRuleBlock(
      subcaseRules[normalizedUseCase.primary][normalizedUseCase.secondary] ?? []
    )
  };
}
