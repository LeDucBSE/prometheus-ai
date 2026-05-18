import { z } from "zod";
import { inferenceProviderIds } from "@/lib/api-credentials/types";

export const inferenceProviderSchema = z.enum(inferenceProviderIds);

export const apiCredentialsSchema = z.object({
  provider: inferenceProviderSchema,
  apiKey: z.string().trim().min(8, "La clé API est trop courte.").max(512),
  model: z.string().trim().min(1).max(120).optional()
});

export const storedApiCredentialsSchema = apiCredentialsSchema;

export type StoredApiCredentialsInput = z.infer<typeof apiCredentialsSchema>;

export function parseApiCredentials(input: unknown) {
  return apiCredentialsSchema.safeParse(input);
}
