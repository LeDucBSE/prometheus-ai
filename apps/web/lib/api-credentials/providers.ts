import type { InferenceProviderId } from "@/lib/api-credentials/types";

export type InferenceProviderOption = {
  id: InferenceProviderId;
  label: string;
  description: string;
  defaultModel: string;
  docsUrl: string;
  keyPlaceholder: string;
};

export const INFERENCE_PROVIDER_OPTIONS: readonly InferenceProviderOption[] = [
  {
    id: "openrouter",
    label: "OpenRouter",
    description: "Une clé pour accéder à de nombreux modèles (recommandé).",
    defaultModel: "anthropic/claude-sonnet-4.6",
    docsUrl: "https://openrouter.ai/keys",
    keyPlaceholder: "sk-or-v1-..."
  },
  {
    id: "anthropic",
    label: "Anthropic",
    description: "API directe Claude avec support documents et images.",
    defaultModel: "claude-sonnet-4-6",
    docsUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-..."
  },
  {
    id: "openai",
    label: "OpenAI",
    description: "GPT-4o et modèles compatibles chat completions.",
    defaultModel: "gpt-4o",
    docsUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-..."
  },
  {
    id: "mistral",
    label: "Mistral",
    description: "API Mistral AI pour modèles Mistral Large et compatibles.",
    defaultModel: "mistral-large-latest",
    docsUrl: "https://console.mistral.ai/api-keys",
    keyPlaceholder: "..."
  },
  {
    id: "google",
    label: "Google AI",
    description: "Gemini via Google AI Studio.",
    defaultModel: "gemini-2.5-flash",
    docsUrl: "https://aistudio.google.com/apikey",
    keyPlaceholder: "AIza..."
  }
] as const;

export function getInferenceProviderOption(provider: InferenceProviderId) {
  const match = INFERENCE_PROVIDER_OPTIONS.find((option) => option.id === provider);
  if (!match) {
    throw new Error(`Unknown inference provider: ${provider}`);
  }

  return match;
}

export function resolveInferenceModel(provider: InferenceProviderId, model?: string | null) {
  const trimmedModel = model?.trim();
  if (trimmedModel) {
    return trimmedModel;
  }

  return getInferenceProviderOption(provider).defaultModel;
}
