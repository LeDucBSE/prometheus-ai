import { z } from "zod";
import { inferenceProviderSchema } from "@/lib/api-credentials/schemas";
import { useCasePrimaryIds } from "@/lib/transform/use-cases";

export const targetModelSchema = z.enum([
  "claude",
  "gemini",
  "chatgpt",
  "grok",
  "mistral",
  "perplexity"
]);
export const supportedTransformImageMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
] as const;
export const useCasePrimarySchema = z.enum(useCasePrimaryIds);
export const optionalUseCaseSecondarySchema = z
  .union([z.string().trim().min(1).max(80), z.null()])
  .optional();
const transformAttachmentBaseSchema = z.object({
  name: z.string().trim().min(1).max(260),
  relative_path: z.string().trim().min(1).max(1_024),
  size_bytes: z.number().int().nonnegative().max(50 * 1024 * 1024)
});
export const transformAttachmentSchema = z.discriminatedUnion("kind", [
  transformAttachmentBaseSchema.extend({
    kind: z.literal("text"),
    media_type: z.literal("text/plain"),
    content: z.string().trim().min(1).max(25_000)
  }),
  transformAttachmentBaseSchema.extend({
    kind: z.literal("image"),
    media_type: z.enum(supportedTransformImageMediaTypes),
    data_base64: z.string().min(1).max(7_000_000)
  }),
  transformAttachmentBaseSchema.extend({
    kind: z.literal("pdf"),
    media_type: z.literal("application/pdf"),
    data_base64: z.string().min(1).max(7_000_000)
  })
]);

export const transformRequestSchema = z
  .object({
    inference_provider: inferenceProviderSchema.optional(),
    api_key: z.string().trim().min(8).max(512).optional(),
    inference_model: z.string().trim().min(1).max(120).optional(),
    raw_prompt: z
      .string({
        invalid_type_error: "The 'raw_prompt' field must be a string."
      })
      .trim()
      .max(12000, "The 'raw_prompt' field is too long.")
      .optional()
      .default(""),
    target_model: targetModelSchema,
    use_case_primary: useCasePrimarySchema.optional().nullable(),
    use_case_secondary: optionalUseCaseSecondarySchema,
    attachments: z
      .array(transformAttachmentSchema)
      .max(48, "Too many attachments were provided.")
      .optional()
      .default([])
  })
  .superRefine((value, context) => {
    if (value.raw_prompt || value.attachments.length > 0) {
      return;
    }

    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The request must include a prompt or at least one attachment.",
      path: ["raw_prompt"]
    });
  });

export const transformResponseSchema = z.object({
  expert_prompt: z.string().trim().min(1, "The model returned an empty response."),
  model_used: z.string().min(1),
  tokens_used: z.number().int().nonnegative(),
  inference_provider: inferenceProviderSchema.optional(),
  inference_model: z.string().min(1).optional()
});

export type TransformRequest = z.infer<typeof transformRequestSchema>;
export type TransformResponse = z.infer<typeof transformResponseSchema>;
export type TargetModel = z.infer<typeof targetModelSchema>;
export type UseCasePrimary = z.infer<typeof useCasePrimarySchema>;
export type TransformAttachment = z.infer<typeof transformAttachmentSchema>;

export function parseTransformRequest(input: unknown) {
  return transformRequestSchema.safeParse(input);
}

export function parseTransformResponse(input: unknown) {
  return transformResponseSchema.safeParse(input);
}
