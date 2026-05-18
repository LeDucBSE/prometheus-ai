import { describe, expect, it } from "vitest";
import { compileTransformationContext } from "@/lib/transform/compiler";

describe("transform compiler", () => {
  it("falls back safely when no use case is provided", () => {
    const compiled = compileTransformationContext({ targetModel: "chatgpt" });

    expect(compiled.normalizedUseCase.primary).toBe("other");
    expect(compiled.normalizedUseCase.secondary).toBe("general");
    expect(compiled.useCaseRules).toContain("flexible, high-clarity transformation");
  });

  it("keeps code debug instructions distinct", () => {
    const compiled = compileTransformationContext({
      targetModel: "claude",
      useCasePrimary: "code",
      useCaseSecondary: "debug"
    });

    expect(compiled.modelRules).toContain("Optimize the transformed prompt for Claude.");
    expect(compiled.useCaseRules).toContain("language or framework context");
    expect(compiled.subcaseRules).toContain("failure symptoms");
  });

  it("defaults the subcase to the first option for a selected use case", () => {
    const compiled = compileTransformationContext({
      targetModel: "gemini",
      useCasePrimary: "ai-agent"
    });

    expect(compiled.normalizedUseCase.secondary).toBe("system-prompt");
    expect(compiled.subcaseRules).toContain("persistent behavior");
  });

  it("includes stable-prefix guidance for Grok", () => {
    const compiled = compileTransformationContext({ targetModel: "grok" });

    expect(compiled.modelRules).toContain("Optimize the transformed prompt for Grok.");
    expect(compiled.referenceApplication).toContain("stable and front-loaded");
  });
});
