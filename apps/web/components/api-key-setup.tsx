"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { INFERENCE_PROVIDER_OPTIONS } from "@/lib/api-credentials/providers";
import type { ApiCredentials } from "@/lib/api-credentials/types";
import {
  clearApiCredentials,
  hasConfiguredApiCredentials,
  readApiCredentials,
  writeApiCredentials
} from "@/lib/api-credentials/storage";
import { Button } from "@/components/ui/button";

export function ApiKeySetup({
  onConfiguredChange
}: {
  onConfiguredChange?: (configured: boolean) => void;
}) {
  const [provider, setProvider] = useState<ApiCredentials["provider"]>("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedCredentials = readApiCredentials();
    if (storedCredentials) {
      setProvider(storedCredentials.provider ?? "openrouter");
      setApiKey(storedCredentials.apiKey ?? "");
      setModel(storedCredentials.model ?? "");
    }
    setSaved(hasConfiguredApiCredentials());
  }, []);

  const selectedProvider = INFERENCE_PROVIDER_OPTIONS.find((option) => option.id === provider);

  useEffect(() => {
    onConfiguredChange?.(saved);
  }, [onConfiguredChange, saved]);

  const handleSave = () => {
    setError("");

    try {
      writeApiCredentials({
        provider,
        apiKey,
        model: model.trim() || undefined
      });
      setSaved(true);
      onConfiguredChange?.(true);
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Impossible d'enregistrer la clé API.";
      setError(message);
      setSaved(false);
      onConfiguredChange?.(false);
    }
  };

  const handleClear = () => {
    clearApiCredentials();
    setApiKey("");
    setModel("");
    setSaved(false);
    setError("");
    onConfiguredChange?.(false);
  };

  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-left shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
          <KeyRound className="h-5 w-5 text-white/85" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-white/92">Connecte ton fournisseur IA</h2>
          <p className="text-sm leading-6 text-white/55">
            Ta clé reste dans ton navigateur. Prometheus l&apos;utilise uniquement pour transformer tes
            prompts — tu paies directement ton fournisseur.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Fournisseur
          </span>
          <select
            value={provider}
            onChange={(event) => {
              setProvider(event.target.value as ApiCredentials["provider"]);
              setSaved(false);
            }}
            className="h-11 w-full appearance-none rounded-2xl border border-white/10 bg-[#0d1118] px-4 text-sm text-white/88 outline-none transition focus:border-white/20"
          >
            {INFERENCE_PROVIDER_OPTIONS.map((option) => (
              <option key={option.id} value={option.id} style={{ color: "#111", background: "#fff" }}>
                {option.label}
              </option>
            ))}
          </select>
          {selectedProvider ? (
            <p className="text-xs leading-5 text-white/45">{selectedProvider.description}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Clé API
          </span>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setSaved(false);
              }}
              placeholder={selectedProvider?.keyPlaceholder ?? "Colle ta clé API"}
              autoComplete="off"
              className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 pr-12 text-sm text-white/88 outline-none transition focus:border-white/20"
            />
            <button
              type="button"
              onClick={() => setShowKey((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/75"
              aria-label={showKey ? "Masquer la clé" : "Afficher la clé"}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {selectedProvider ? (
            <a
              href={selectedProvider.docsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#9ef3dc]/85 underline-offset-2 hover:underline"
            >
              Obtenir une clé {selectedProvider.label}
            </a>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Modèle (optionnel)
          </span>
          <input
            type="text"
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              setSaved(false);
            }}
            placeholder={selectedProvider?.defaultModel ?? "Modèle par défaut du fournisseur"}
            className="h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm text-white/88 outline-none transition focus:border-white/20"
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/92"
          >
            Enregistrer la clé
          </Button>
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300/90">
              <ShieldCheck className="h-4 w-4" />
              Clé enregistrée localement
            </span>
          ) : null}
          {saved ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-white/42 underline-offset-2 transition hover:text-white/68 hover:underline"
            >
              Supprimer la clé
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
