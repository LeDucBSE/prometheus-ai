import { readApiCredentials } from "@/lib/api-credentials/storage";

export function getTransformAuthPayload() {
  const credentials = readApiCredentials();

  if (!credentials?.apiKey) {
    throw new Error(
      "Aucune clé API configurée. Retourne à l'accueil pour connecter ton fournisseur."
    );
  }

  return {
    inference_provider: credentials.provider,
    api_key: credentials.apiKey,
    inference_model: credentials.model
  };
}
