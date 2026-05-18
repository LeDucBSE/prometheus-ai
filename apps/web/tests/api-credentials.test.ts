import { describe, expect, it } from "vitest";
import { resolveInferenceModel } from "@/lib/api-credentials/providers";
import { parseApiCredentials } from "@/lib/api-credentials/schemas";

describe("api credentials", () => {
  it("parses valid credentials", () => {
    const parsed = parseApiCredentials({
      provider: "openrouter",
      apiKey: "sk-or-v1-test-key",
      model: "anthropic/claude-sonnet-4.6"
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects short api keys", () => {
    const parsed = parseApiCredentials({
      provider: "openai",
      apiKey: "short"
    });

    expect(parsed.success).toBe(false);
  });

  it("falls back to provider default model", () => {
    expect(resolveInferenceModel("mistral")).toBe("mistral-large-latest");
    expect(resolveInferenceModel("openai", "gpt-4.1")).toBe("gpt-4.1");
  });
});
