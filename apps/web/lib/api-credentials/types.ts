export const inferenceProviderIds = [
  "openrouter",
  "anthropic",
  "openai",
  "mistral",
  "google"
] as const;

export type InferenceProviderId = (typeof inferenceProviderIds)[number];

export type ApiCredentials = {
  provider: InferenceProviderId;
  apiKey: string;
  model?: string;
};
