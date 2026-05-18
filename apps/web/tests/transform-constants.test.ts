import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "@/lib/transform/constants";
import { ANTHROPIC_PROMPTING_REFERENCE } from "@/lib/transform/anthropic-guidelines";

describe("transform constants", () => {
  it("embeds the Anthropic prompting reference in the system prompt", () => {
    const systemPrompt = buildSystemPrompt({ targetModel: "claude" });

    expect(ANTHROPIC_PROMPTING_REFERENCE).toContain("Anthropic prompt engineering reference");
    expect(systemPrompt).toContain("<anthropic_prompting_reference>");
    expect(systemPrompt).toContain(ANTHROPIC_PROMPTING_REFERENCE);
  });

  it("defaults to a paste-ready prompt for non-agent tasks", () => {
    const systemPrompt = buildSystemPrompt({ targetModel: "chatgpt" });

    expect(systemPrompt).toContain("Default to a single paste-ready prompt");
    expect(systemPrompt).toContain("Structure A: Direct execution prompt (default)");
    expect(systemPrompt).toContain("Structure B: Reusable assistant or agent prompt package");
    expect(systemPrompt).toContain("Image prompt optimization active: no");
  });

  it("includes target-model-specific guidance", () => {
    const geminiPrompt = buildSystemPrompt({ targetModel: "gemini" });

    expect(geminiPrompt).toContain("Selected destination model: gemini");
    expect(geminiPrompt).toContain("Optimize the transformed prompt for Gemini.");
  });

  it("embeds selected-model documentation for newly added providers", () => {
    const grokPrompt = buildSystemPrompt({ targetModel: "grok" });
    const mistralPrompt = buildSystemPrompt({ targetModel: "mistral" });
    const perplexityPrompt = buildSystemPrompt({ targetModel: "perplexity" });

    expect(grokPrompt).toContain("<selected_model_documentation>");
    expect(grokPrompt).toContain("xAI stable-prefix profile");
    expect(grokPrompt).toContain("https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices");

    expect(mistralPrompt).toContain("Mistral compact-schema profile");
    expect(mistralPrompt).toContain("https://docs.mistral.ai/capabilities/structured-output/custom_structured_output/");

    expect(perplexityPrompt).toContain("Perplexity grounded-research profile");
    expect(perplexityPrompt).toContain("Do not ask the model to invent inline source URLs");
  });

  it("injects provider-specific image-generation documentation when image prompting is active", () => {
    const grokPrompt = buildSystemPrompt({
      targetModel: "grok",
      useCasePrimary: "image",
      useCaseSecondary: "general-image",
      originalUseCasePrimary: "other",
      originalUseCaseSecondary: "general",
      imagePromptOptimizationActive: true,
      imagePromptOptimizationReason: "Auto-switched because the raw request asked for an image prompt."
    });
    const geminiPrompt = buildSystemPrompt({
      targetModel: "gemini",
      useCasePrimary: "image",
      useCaseSecondary: "general-image",
      imagePromptOptimizationActive: true,
      imagePromptOptimizationReason: "Image prompt requested."
    });
    const chatgptPrompt = buildSystemPrompt({
      targetModel: "chatgpt",
      useCasePrimary: "image",
      useCaseSecondary: "general-image",
      imagePromptOptimizationActive: true,
      imagePromptOptimizationReason: "Image prompt requested."
    });

    expect(grokPrompt).toContain("Preferred image engine: grok-imagine-image");
    expect(grokPrompt).toContain("https://docs.x.ai/docs/guides/image-generation");
    expect(geminiPrompt).toContain("Preferred image engine: gemini-2.5-flash-image (Nano Banana)");
    expect(geminiPrompt).toContain("https://ai.google.dev/gemini-api/docs/image-generation");
    expect(chatgptPrompt).toContain("Preferred image engine: gpt-image-1 / gpt-image-1.5");
    expect(chatgptPrompt).toContain("https://platform.openai.com/docs/guides/tools-image-generation");
  });

  it("normalizes dictated thoughts without inventing requirements", () => {
    const systemPrompt = buildSystemPrompt({ targetModel: "chatgpt" });

    expect(systemPrompt).toContain("If the input contains dictated thoughts");
    expect(systemPrompt).toContain("without inventing requirements");
  });

  it("falls back to Other > General when no use case is selected", () => {
    const systemPrompt = buildSystemPrompt({ targetModel: "chatgpt" });

    expect(systemPrompt).toContain("Effective primary use case for transformation: Other");
    expect(systemPrompt).toContain("Effective secondary use case for transformation: General");
  });

  it("includes code debug guidance when that use case is selected", () => {
    const systemPrompt = buildSystemPrompt({
      targetModel: "claude",
      useCasePrimary: "code",
      useCaseSecondary: "debug"
    });

    expect(systemPrompt).toContain("Effective primary use case for transformation: Code");
    expect(systemPrompt).toContain("Effective secondary use case for transformation: Debug");
    expect(systemPrompt).toContain("Distinguish clearly between generating, debugging, refactoring");
    expect(systemPrompt).toContain("Prioritize failure symptoms, reproduction clues, likely root causes");
  });

  it("includes image thumbnail guidance for image-generation prompts", () => {
    const systemPrompt = buildSystemPrompt({
      targetModel: "gemini",
      useCasePrimary: "image",
      useCaseSecondary: "thumbnail-cover"
    });

    expect(systemPrompt).toContain("Effective secondary use case for transformation: Thumbnail/Cover");
    expect(systemPrompt).toContain("Structure the prompt around subject, composition, style, lighting");
    expect(systemPrompt).toContain("Optimize for glanceability, focal hierarchy, bold framing");
  });

  it("guards against turning image prompt requests into meta analysis", () => {
    const systemPrompt = buildSystemPrompt({
      targetModel: "grok",
      useCasePrimary: "image",
      useCaseSecondary: "photorealistic"
    });

    expect(systemPrompt).toContain("If the selected primary use case is Image");
    expect(systemPrompt).toContain("return the actual image-generation prompt");
    expect(systemPrompt).toContain("Do not turn a direct task request into a meta-prompt");
    expect(systemPrompt).toContain("the output must directly instruct that target model");
  });

  it("shows the original and effective use case when image prompting is auto-inferred", () => {
    const systemPrompt = buildSystemPrompt({
      targetModel: "grok",
      useCasePrimary: "image",
      useCaseSecondary: "poster",
      originalUseCasePrimary: "other",
      originalUseCaseSecondary: "general",
      imagePromptOptimizationActive: true,
      imagePromptOptimizationReason: "Auto-switched to image prompting because prompt wording requested, image artifact referenced."
    });

    expect(systemPrompt).toContain("Original selected primary use case: Other");
    expect(systemPrompt).toContain("Effective primary use case for transformation: Image");
    expect(systemPrompt).toContain("Reason: Auto-switched to image prompting");
  });
});
