import { buildSystemPrompt } from "@/lib/transform/constants";
import { resolveTransformIntent } from "@/lib/transform/intent";
import { InferenceError, runInference } from "@/lib/transform/inference";
import type { ApiCredentials } from "@/lib/api-credentials/types";
import type { InferenceProviderId } from "@/lib/api-credentials/types";
import { resolveInferenceModel } from "@/lib/api-credentials/providers";
import type {
  TransformAttachment,
  TransformRequest,
  TransformResponse
} from "@/lib/transform/schemas";

class TransformServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "TransformServiceError";
    this.status = status;
  }
}

function formatAttachmentInventoryLine(attachment: TransformAttachment) {
  const kindLabel =
    attachment.kind === "text"
      ? "text file"
      : attachment.kind === "pdf"
        ? "PDF"
        : "image";

  return `- ${attachment.relative_path} (${kindLabel})`;
}

function buildAttachmentBlock(
  attachment: TransformAttachment
): import("@anthropic-ai/sdk").Anthropic.Messages.ContentBlockParam {
  if (attachment.kind === "text") {
    return {
      type: "document",
      title: attachment.name,
      context:
        attachment.relative_path === attachment.name
          ? null
          : `Attached file path: ${attachment.relative_path}`,
      source: {
        type: "text",
        media_type: "text/plain",
        data: attachment.content
      }
    };
  }

  if (attachment.kind === "pdf") {
    return {
      type: "document",
      title: attachment.name,
      context:
        attachment.relative_path === attachment.name
          ? null
          : `Attached file path: ${attachment.relative_path}`,
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: attachment.data_base64
      }
    };
  }

  return {
    type: "image",
    source: {
      type: "base64",
      media_type: attachment.media_type,
      data: attachment.data_base64
    }
  };
}

export function buildTransformUserContent(
  rawPrompt: string,
  attachments: TransformAttachment[]
): import("@anthropic-ai/sdk").Anthropic.Messages.ContentBlockParam[] {
  const trimmedRawPrompt = rawPrompt.trim();
  const introLines = [
    trimmedRawPrompt ||
      "Use the attached source material as the basis for an expert AI engineering prompt."
  ];

  if (attachments.length > 0) {
    introLines.push(
      "",
      "Attached source material (mandatory input):",
      ...attachments.map(formatAttachmentInventoryLine),
      "",
      "Instructions for attachments:",
      "- Read every attached file in this message before transforming the prompt.",
      "- Treat attached text files and PDFs as primary source material when the user prompt is brief.",
      "- Treat attached images as visual references, screenshots, mockups, or style anchors when relevant.",
      "- Ground the transformed prompt in concrete facts, structure, and constraints found in the attachments.",
      "- Do not invent details that are not supported by the prompt or the attachments."
    );
  }

  return [
    {
      type: "text",
      text: introLines.join("\n")
    },
    ...attachments.map(buildAttachmentBlock)
  ];
}

export function resolveTransformCredentials(request: TransformRequest): ApiCredentials {
  if (request.inference_provider && request.api_key) {
    return {
      provider: request.inference_provider,
      apiKey: request.api_key,
      model: request.inference_model
    };
  }

  throw new TransformServiceError(
    "API credentials are required. Add your provider API key on the home page before using the workspace.",
    401
  );
}

export async function transformPrompt(request: TransformRequest): Promise<TransformResponse> {
  const {
    raw_prompt: rawPrompt,
    target_model: targetModel,
    use_case_primary: useCasePrimary,
    use_case_secondary: useCaseSecondary,
    attachments = []
  } = request;

  try {
    const credentials = resolveTransformCredentials(request);
    const intent = resolveTransformIntent({
      rawPrompt,
      useCasePrimary,
      useCaseSecondary,
      attachmentKinds: attachments.map((attachment) => attachment.kind)
    });

    const inference = await runInference(credentials, {
      system: buildSystemPrompt({
        targetModel,
        useCasePrimary: intent.effectiveUseCasePrimary,
        useCaseSecondary: intent.effectiveUseCaseSecondary,
        originalUseCasePrimary: useCasePrimary,
        originalUseCaseSecondary: useCaseSecondary,
        imagePromptOptimizationActive: intent.imagePromptOptimizationActive,
        imagePromptOptimizationReason: intent.imagePromptOptimizationReason,
        useCaseInferenceReason: intent.useCaseInferenceReason,
        attachments
      }),
      userContent: buildTransformUserContent(rawPrompt, attachments),
      maxTokens: 2200,
      temperature: 0.2
    });

    return {
      expert_prompt: inference.text,
      model_used: inference.modelUsed,
      tokens_used: inference.tokensUsed,
      inference_provider: credentials.provider,
      inference_model: resolveInferenceModel(credentials.provider, credentials.model)
    };
  } catch (error) {
    if (error instanceof TransformServiceError || error instanceof InferenceError) {
      throw new TransformServiceError(error.message, error.status);
    }

    throw new TransformServiceError("An unexpected server error occurred.", 500);
  }
}
