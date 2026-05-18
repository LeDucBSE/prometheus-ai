import { describe, expect, it } from "vitest";
import {
  parseTransformRequest,
  parseTransformResponse
} from "@/lib/transform/schemas";

describe("transform schemas", () => {
  it("accepts a valid transform request", () => {
    const result = parseTransformRequest({
      raw_prompt: "Write a better hiring prompt for screening engineers.",
      target_model: "claude"
    });

    expect(result.success).toBe(true);
  });

  it("accepts BYOK inference credentials on transform requests", () => {
    const result = parseTransformRequest({
      raw_prompt: "Rewrite this prompt.",
      target_model: "claude",
      inference_provider: "openrouter",
      api_key: "sk-or-v1-test-key-123456",
      inference_model: "anthropic/claude-sonnet-4.6"
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty transform request", () => {
    const result = parseTransformRequest({
      raw_prompt: "   ",
      target_model: "claude"
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unknown target model", () => {
    const result = parseTransformRequest({
      raw_prompt: "Rewrite this prompt.",
      target_model: "llama"
    });

    expect(result.success).toBe(false);
  });

  it("accepts the newly supported target models", () => {
    const models = ["grok", "mistral", "perplexity"] as const;

    for (const targetModel of models) {
      const result = parseTransformRequest({
        raw_prompt: `Rewrite this prompt for ${targetModel}.`,
        target_model: targetModel
      });

      expect(result.success).toBe(true);
    }
  });

  it("accepts a valid transform response", () => {
    const result = parseTransformResponse({
      expert_prompt: "<role>You are a recruiter</role>",
      model_used: "claude-sonnet-4-6",
      tokens_used: 321
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid transform response", () => {
    const result = parseTransformResponse({
      expert_prompt: "",
      model_used: "",
      tokens_used: -1
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid use-case-aware transform request", () => {
    const result = parseTransformRequest({
      raw_prompt: "Find the issue in this React component.",
      target_model: "chatgpt",
      use_case_primary: "code",
      use_case_secondary: "debug"
    });

    expect(result.success).toBe(true);
  });

  it("accepts attachment-only requests", () => {
    const result = parseTransformRequest({
      target_model: "claude",
      attachments: [
        {
          kind: "text",
          name: "notes.md",
          relative_path: "notes.md",
          size_bytes: 42,
          media_type: "text/plain",
          content: "Use this file as source material."
        }
      ]
    });

    expect(result.success).toBe(true);
  });

  it("accepts multimodal attachments in the request payload", () => {
    const result = parseTransformRequest({
      raw_prompt: "Turn these materials into a sharper prompt.",
      target_model: "claude",
      attachments: [
        {
          kind: "image",
          name: "cover.png",
          relative_path: "assets/cover.png",
          size_bytes: 1024,
          media_type: "image/png",
          data_base64: "aGVsbG8="
        },
        {
          kind: "pdf",
          name: "brief.pdf",
          relative_path: "docs/brief.pdf",
          size_bytes: 2048,
          media_type: "application/pdf",
          data_base64: "aGVsbG8="
        }
      ]
    });

    expect(result.success).toBe(true);
  });

  it("rejects an unknown use case", () => {
    const result = parseTransformRequest({
      raw_prompt: "Rewrite this prompt.",
      target_model: "claude",
      use_case_primary: "video"
    });

    expect(result.success).toBe(false);
  });

  it("rejects a request without prompt or attachments", () => {
    const result = parseTransformRequest({
      raw_prompt: "   ",
      target_model: "claude",
      attachments: []
    });

    expect(result.success).toBe(false);
  });
});
