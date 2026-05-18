import Anthropic from "@anthropic-ai/sdk";
import { getInferenceProviderOption, resolveInferenceModel } from "@/lib/api-credentials/providers";
import type { ApiCredentials } from "@/lib/api-credentials/types";

export type InferenceMessageContent = Anthropic.Messages.ContentBlockParam[];

export type InferenceRequest = {
  system: string;
  userContent: InferenceMessageContent;
  maxTokens: number;
  temperature: number;
};

export type InferenceResult = {
  text: string;
  modelUsed: string;
  tokensUsed: number;
};

class InferenceError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "InferenceError";
    this.status = status;
  }
}

function extractAnthropicText(response: Anthropic.Messages.Message) {
  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}

function calculateAnthropicTokens(response: Anthropic.Messages.Message) {
  return (response.usage.input_tokens ?? 0) + (response.usage.output_tokens ?? 0);
}

function createAnthropicSdkClient(credentials: ApiCredentials, baseURL?: string) {
  return new Anthropic({
    apiKey: credentials.provider === "anthropic" ? credentials.apiKey : null,
    authToken: credentials.provider === "anthropic" ? undefined : credentials.apiKey,
    baseURL,
    defaultHeaders:
      credentials.provider === "openrouter"
        ? {
            "HTTP-Referer": "https://github.com/prometheus-ai",
            "X-Title": "Prometheus AI"
          }
        : undefined
  });
}

async function runAnthropicCompatibleInference(
  credentials: ApiCredentials,
  request: InferenceRequest,
  baseURL?: string
): Promise<InferenceResult> {
  const client = createAnthropicSdkClient(credentials, baseURL);
  const model = resolveInferenceModel(credentials.provider, credentials.model);

  const response = await client.messages.create({
    model,
    max_tokens: request.maxTokens,
    temperature: request.temperature,
    system: request.system,
    messages: [
      {
        role: "user",
        content: request.userContent
      }
    ]
  });

  const text = extractAnthropicText(response);
  if (!text) {
    throw new InferenceError("The model returned an empty response.", 502);
  }

  return {
    text,
    modelUsed: model,
    tokensUsed: calculateAnthropicTokens(response)
  };
}

type OpenAIChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

function mapContentToOpenAIParts(content: InferenceMessageContent): OpenAIChatContentPart[] {
  const parts: OpenAIChatContentPart[] = [];

  for (const block of content) {
    if (block.type === "text") {
      parts.push({ type: "text", text: block.text });
      continue;
    }

    if (block.type === "image") {
      const mediaType = block.source.type === "base64" ? block.source.media_type : "image/png";
      const data = block.source.type === "base64" ? block.source.data : "";
      parts.push({
        type: "image_url",
        image_url: {
          url: `data:${mediaType};base64,${data}`
        }
      });
      continue;
    }

    if (block.type === "document") {
      if (block.source.type === "text") {
        parts.push({
          type: "text",
          text: `Attached document (${block.title ?? "document"}):\n${block.source.data}`
        });
      } else {
        parts.push({
          type: "text",
          text: `Attached PDF (${block.title ?? "document"}): included as base64; use any visible text cues from the user prompt.`
        });
      }
    }
  }

  return parts;
}

async function runOpenAICompatibleInference(
  credentials: ApiCredentials,
  request: InferenceRequest,
  endpoint: string
): Promise<InferenceResult> {
  const model = resolveInferenceModel(credentials.provider, credentials.model);
  const userParts = mapContentToOpenAIParts(request.userContent);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: request.temperature,
      max_tokens: request.maxTokens,
      messages: [
        { role: "system", content: request.system },
        {
          role: "user",
          content: userParts.length === 1 && userParts[0]?.type === "text" ? userParts[0].text : userParts
        }
      ]
    })
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  if (!response.ok) {
    throw new InferenceError(payload.error?.message ?? "The model API request failed.", response.status);
  }

  const rawContent = payload.choices?.[0]?.message?.content;
  const text =
    typeof rawContent === "string"
      ? rawContent.trim()
      : Array.isArray(rawContent)
        ? rawContent
            .filter((part) => part.type === "text")
            .map((part) => part.text ?? "")
            .join("")
            .trim()
        : "";

  if (!text) {
    throw new InferenceError("The model returned an empty response.", 502);
  }

  return {
    text,
    modelUsed: payload.model ?? model,
    tokensUsed: (payload.usage?.prompt_tokens ?? 0) + (payload.usage?.completion_tokens ?? 0)
  };
}

function mapContentToGeminiParts(content: InferenceMessageContent) {
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  for (const block of content) {
    if (block.type === "text") {
      parts.push({ text: block.text });
      continue;
    }

    if (block.type === "image" && block.source.type === "base64") {
      parts.push({
        inlineData: {
          mimeType: block.source.media_type,
          data: block.source.data
        }
      });
      continue;
    }

    if (block.type === "document") {
      if (block.source.type === "text") {
        parts.push({
          text: `Attached document (${block.title ?? "document"}):\n${block.source.data}`
        });
      } else if (block.source.type === "base64") {
        parts.push({
          inlineData: {
            mimeType: block.source.media_type,
            data: block.source.data
          }
        });
      }
    }
  }

  return parts;
}

async function runGoogleInference(
  credentials: ApiCredentials,
  request: InferenceRequest
): Promise<InferenceResult> {
  const model = resolveInferenceModel(credentials.provider, credentials.model);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(credentials.apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: request.system }]
      },
      generationConfig: {
        temperature: request.temperature,
        maxOutputTokens: request.maxTokens
      },
      contents: [
        {
          role: "user",
          parts: mapContentToGeminiParts(request.userContent)
        }
      ]
    })
  });

  const payload = (await response.json()) as {
    error?: { message?: string };
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
    };
  };

  if (!response.ok) {
    throw new InferenceError(payload.error?.message ?? "The Gemini API request failed.", response.status);
  }

  const text =
    payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) {
    throw new InferenceError("The model returned an empty response.", 502);
  }

  return {
    text,
    modelUsed: model,
    tokensUsed:
      (payload.usageMetadata?.promptTokenCount ?? 0) + (payload.usageMetadata?.candidatesTokenCount ?? 0)
  };
}

export async function runInference(
  credentials: ApiCredentials,
  request: InferenceRequest
): Promise<InferenceResult> {
  getInferenceProviderOption(credentials.provider);

  try {
    switch (credentials.provider) {
      case "openrouter":
        return runAnthropicCompatibleInference(credentials, request, "https://openrouter.ai/api");
      case "anthropic":
        return runAnthropicCompatibleInference(credentials, request);
      case "openai":
        return runOpenAICompatibleInference(credentials, request, "https://api.openai.com/v1/chat/completions");
      case "mistral":
        return runOpenAICompatibleInference(credentials, request, "https://api.mistral.ai/v1/chat/completions");
      case "google":
        return runGoogleInference(credentials, request);
      default:
        throw new InferenceError("Unsupported inference provider.", 400);
    }
  } catch (error) {
    if (error instanceof InferenceError) {
      throw error;
    }

    if (error instanceof Anthropic.APIError) {
      throw new InferenceError(error.message || "The model API request failed.", error.status || 502);
    }

    throw new InferenceError(
      error instanceof Error ? error.message : "An unexpected model API error occurred.",
      500
    );
  }
}

export { InferenceError };
