import { parseApiCredentials } from "@/lib/api-credentials/schemas";
import type { ApiCredentials } from "@/lib/api-credentials/types";

const STORAGE_KEY = "prometheus-ai.api-credentials.v1";

export function readApiCredentials(): ApiCredentials | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = parseApiCredentials(JSON.parse(raw));
    if (!parsed.success) {
      return null;
    }

    return {
      provider: parsed.data.provider,
      apiKey: parsed.data.apiKey,
      model: parsed.data.model
    };
  } catch {
    return null;
  }
}

export function writeApiCredentials(credentials: ApiCredentials) {
  if (typeof window === "undefined") {
    return;
  }

  const parsed = parseApiCredentials(credentials);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid API credentials.");
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
}

export function clearApiCredentials() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasConfiguredApiCredentials() {
  return Boolean(readApiCredentials()?.apiKey);
}
