"use client";

import { Check, Copy, LoaderCircle, Mic, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { SiMistralai, SiPerplexity, SiX } from "react-icons/si";
import { TARGET_MODEL_OPTIONS } from "@/lib/transform/models";
import type { TargetModel } from "@/lib/transform/schemas";

type TransformResponse = {
  expert_prompt: string;
  model_used: string;
  tokens_used: number;
};

function ClaudeMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d97706]/10">
      <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#de7a52"
          d="M32 4c2.2 0 3.9 1.8 3.8 4L34 26.2l10.1-15.1a3.8 3.8 0 0 1 6-.4c1.5 1.6 1.6 4 .2 5.8L39.8 29.3l16.5-7.6a3.8 3.8 0 0 1 5 2c.9 2 .1 4.3-1.9 5.2L42 35l18 2.2a3.8 3.8 0 0 1 3.4 4.9 3.8 3.8 0 0 1-5 2.2l-16.9-6.5 11.2 14.3a3.8 3.8 0 0 1-.5 5.8 3.8 3.8 0 0 1-5.8-.8L36.7 42.1 38 60.2a3.8 3.8 0 0 1-4.2 3.8 3.8 3.8 0 0 1-3.4-3.7l-.5-18.5-11 14.5a3.8 3.8 0 0 1-5.7.7 3.8 3.8 0 0 1-.4-5.7l11.4-13.3L7 44.6a3.8 3.8 0 0 1-4.9-2.4 3.8 3.8 0 0 1 3.2-4.9L23 35.8 6.2 28.4A3.8 3.8 0 0 1 4.4 23a3.8 3.8 0 0 1 5-1.8l16 8.1L14.1 15.9A3.8 3.8 0 0 1 14.2 10a3.8 3.8 0 0 1 5.9.5L30 25.8 28.2 8A3.8 3.8 0 0 1 32 4Z"
        />
      </svg>
    </div>
  );
}

function GeminiMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
      <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
        <defs>
          <linearGradient id="geminiGradient" x1="16%" x2="84%" y1="14%" y2="86%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="22%" stopColor="#ffc62b" />
            <stop offset="48%" stopColor="#16c784" />
            <stop offset="72%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M32 4c1.8 0 3.3 1.2 3.8 3 2.7 11.2 8.1 16.6 19.2 19.3a4 4 0 0 1 0 7.7c-11.2 2.7-16.6 8.1-19.2 19.2a4 4 0 0 1-7.7 0C25.4 42 20 36.6 8.8 34a4 4 0 0 1 0-7.7C20 23.6 25.4 18.2 28 7a4 4 0 0 1 4-3Z"
          fill="url(#geminiGradient)"
        />
      </svg>
    </div>
  );
}

function ChatGptMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.96 2.5a4.5 4.5 0 0 1 3.88 2.2 4.38 4.38 0 0 1 4.24 1.92 4.42 4.42 0 0 1 .2 4.66 4.43 4.43 0 0 1-.22 4.63 4.4 4.4 0 0 1-4.08 1.95A4.5 4.5 0 0 1 12 21.5a4.5 4.5 0 0 1-3.9-2.2 4.4 4.4 0 0 1-4.17-1.94 4.42 4.42 0 0 1-.22-4.65 4.41 4.41 0 0 1 .21-4.62A4.38 4.38 0 0 1 8 4.12a4.48 4.48 0 0 1 3.96-1.62Zm-2.6 4.06A2.86 2.86 0 0 0 6.4 8.24a2.86 2.86 0 0 0 .13 3.32l2.58-1.49 2.87 1.66V8.44L9.36 6.56Zm5.26 0-2.63 1.52v3.3l2.86-1.65 2.59 1.5a2.87 2.87 0 0 0 .12-3.34 2.84 2.84 0 0 0-2.94-1.33ZM9.1 12.27l-2.86 1.65-.03 2.98a2.86 2.86 0 0 0 3.04.56 2.84 2.84 0 0 0 1.74-2.83v-2.36l-1.89 1.1Zm5.8 0-2.87 1.66v.7a2.85 2.85 0 0 0 1.78 2.84 2.85 2.85 0 0 0 2.99-.53v-3.03l-1.9-1.1Zm-1.46 6.22a2.86 2.86 0 0 0 1.84-2.28l-2.57-1.48-2.86 1.65-2.58-1.5a2.86 2.86 0 0 0 1.85 3.62 2.84 2.84 0 0 0 3.02-.58 2.84 2.84 0 0 0 1.3.57Z"
        />
      </svg>
    </div>
  );
}

function GrokMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
      <SiX className="h-5 w-5 text-white" aria-hidden="true" />
    </div>
  );
}

function MistralMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
      <SiMistralai className="h-5 w-5 text-white" aria-hidden="true" />
    </div>
  );
}

function PerplexityMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.06]">
      <SiPerplexity className="h-5 w-5 text-white" aria-hidden="true" />
    </div>
  );
}

function ModelLogo({ model }: { model: TargetModel }) {
  if (model === "claude") {
    return <ClaudeMark />;
  }

  if (model === "gemini") {
    return <GeminiMark />;
  }

  if (model === "chatgpt") {
    return <ChatGptMark />;
  }

  if (model === "grok") {
    return <GrokMark />;
  }

  if (model === "mistral") {
    return <MistralMark />;
  }

  return <PerplexityMark />;
}

export function PromptTransformer() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [expertPrompt, setExpertPrompt] = useState("");
  const [targetModel, setTargetModel] = useState<TargetModel>("claude");
  const [modelInfo, setModelInfo] = useState<TransformResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedModel =
    TARGET_MODEL_OPTIONS.find((option) => option.id === targetModel) ?? TARGET_MODEL_OPTIONS[0];

  async function handleTransform() {
    const trimmedPrompt = rawPrompt.trim();
    if (!trimmedPrompt) {
      setError("Ajoute une idée ou un brouillon avant de générer.");
      setExpertPrompt("");
      setModelInfo(null);
      return;
    }

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          raw_prompt: trimmedPrompt,
          target_model: targetModel
        })
      });

      const data = (await response.json()) as Partial<TransformResponse> & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "The transformation request failed.");
      }

      setExpertPrompt(data.expert_prompt || "");
      setModelInfo(
        data.expert_prompt
          ? {
              expert_prompt: data.expert_prompt,
              model_used: data.model_used || "",
              tokens_used: data.tokens_used ?? 0
            }
          : null
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setExpertPrompt("");
      setModelInfo(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!expertPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(expertPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access failed. Please copy the prompt manually.");
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-left">
          <p className="text-xl text-white/72 sm:text-2xl">Bonjour</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Par ou commencer ?
          </h1>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex items-start gap-3 rounded-[28px] bg-white/[0.03] px-4 py-4 sm:px-5">
            <button
              type="button"
              className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/72 transition hover:bg-white/[0.1]"
              aria-label="Ajouter une idée"
            >
              <Plus className="h-5 w-5" />
            </button>

            <textarea
              value={rawPrompt}
              onChange={(event) => setRawPrompt(event.target.value)}
              placeholder={selectedModel.placeholder}
              className="min-h-[84px] flex-1 resize-none bg-transparent py-2 text-base leading-7 text-white outline-none placeholder:text-white/38 sm:text-lg"
              aria-label="Prompt de départ"
            />

            <button
              type="button"
              disabled
              className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/40"
              aria-label="Dictée bientôt disponible"
              title="Dictée à venir"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 rounded-[28px] bg-[#0d0d0f]/70 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {TARGET_MODEL_OPTIONS.map((option) => {
                const isActive = option.id === targetModel;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTargetModel(option.id)}
                    className={`inline-flex min-w-[156px] items-center justify-center gap-3 rounded-full border px-4 py-2.5 text-center transition ${
                      isActive
                        ? "border-white/20 bg-white/[0.08] text-white"
                        : "border-white/8 bg-white/[0.03] text-white/62 hover:border-white/14 hover:bg-white/[0.06]"
                    }`}
                  >
                    <ModelLogo model={option.id} />
                    <span className="text-left leading-tight">
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="block text-xs text-white/42">{option.subtitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-4">
              <p className="text-sm text-white/42">
                Le prompt sera optimise pour {selectedModel.label}.
              </p>

              <button
                type="button"
                onClick={handleTransform}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generation..." : `Generer pour ${selectedModel.label}`}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center gap-3 text-sm text-white/56">
            <LoaderCircle className="h-5 w-5 animate-spin text-white/72" />
            Le moteur intelligent prepare votre prompt.
          </div>
        ) : null}

        {error ? (
          <p
            className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {(expertPrompt || modelInfo) && !error ? (
          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/35">Reponse</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Prompt rendu</h2>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!expertPrompt}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copie" : "Copier"}
              </button>
            </div>

            <div className="mt-5 rounded-[24px] bg-[#0b0b0c] px-5 py-5">
              <p className="mb-4 text-sm text-white/35">
                {modelInfo
                  ? `Modele de rendu: ${selectedModel.label} • Moteur: ${modelInfo.model_used} • Tokens: ${modelInfo.tokens_used}`
                  : `Modele de rendu: ${selectedModel.label}`}
              </p>
              <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap break-words pr-1 text-sm leading-7 text-white/86 sm:text-[15px]">
                {expertPrompt}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
