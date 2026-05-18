import { describe, expect, it } from "vitest";
import { resolveTransformIntent } from "@/lib/transform/intent";

describe("transform intent", () => {
  it("keeps the explicit image filter when the user selected it", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Generate a cinematic poster prompt for Grok.",
      useCasePrimary: "image",
      useCaseSecondary: "poster"
    });

    expect(intent.imagePromptOptimizationActive).toBe(true);
    expect(intent.explicitImageSelection).toBe(true);
    expect(intent.effectiveUseCasePrimary).toBe("image");
    expect(intent.effectiveUseCaseSecondary).toBe("poster");
  });

  it("auto-switches to image prompting when the raw request asks for an image prompt", () => {
    const intent = resolveTransformIntent({
      rawPrompt:
        "Write the exact prompt I should paste into Grok to generate a photorealistic image of a PSG jersey with a tone-on-tone logo.",
      useCasePrimary: "other",
      useCaseSecondary: "general"
    });

    expect(intent.imagePromptOptimizationActive).toBe(true);
    expect(intent.explicitImageSelection).toBe(false);
    expect(intent.effectiveUseCasePrimary).toBe("image");
    expect(intent.effectiveUseCaseSecondary).toBe("photorealistic");
    expect(intent.useCaseInferred).toBe(true);
    expect(intent.imagePromptOptimizationReason).toContain("prompt wording requested");
  });

  it("infers a poster-style image prompt when the request mentions a poster output", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Donne-moi le prompt exact a coller dans Gemini pour creer une affiche retro de voyage.",
      useCasePrimary: "text",
      useCaseSecondary: "rewrite"
    });

    expect(intent.imagePromptOptimizationActive).toBe(true);
    expect(intent.effectiveUseCasePrimary).toBe("image");
    expect(intent.effectiveUseCaseSecondary).toBe("poster");
  });

  it("infers code debugging when the user forgot to select a use case", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Debug this TypeScript React hook. The component re-renders infinitely and throws a stack trace."
    });

    expect(intent.effectiveUseCasePrimary).toBe("code");
    expect(intent.effectiveUseCaseSecondary).toBe("debug");
    expect(intent.useCaseInferred).toBe(true);
  });

  it("infers marketing ads when the request mentions ad creative work", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Write a scroll-stopping Meta ads prompt for a skincare launch with a strong CTA."
    });

    expect(intent.effectiveUseCasePrimary).toBe("marketing");
    expect(intent.effectiveUseCaseSecondary).toBe("ads");
    expect(intent.useCaseInferred).toBe(true);
  });

  it("boosts documents use case when PDF attachments are present", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Turn this into a prompt for extracting action items.",
      attachmentKinds: ["pdf"]
    });

    expect(intent.effectiveUseCasePrimary).toBe("documents");
    expect(intent.useCaseInferred).toBe(true);
  });

  it("leaves non-image prompt requests untouched when the signal is weak", () => {
    const intent = resolveTransformIntent({
      rawPrompt: "Write me a cleaner prompt for ChatGPT to summarize my meeting notes.",
      useCasePrimary: "documents",
      useCaseSecondary: "meeting-notes"
    });

    expect(intent.imagePromptOptimizationActive).toBe(false);
    expect(intent.effectiveUseCasePrimary).toBe("documents");
    expect(intent.effectiveUseCaseSecondary).toBe("meeting-notes");
  });
});
