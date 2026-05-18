"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ProcessingStatusPanel, PromptResultPanel } from "@/components/ui/workspace-status-panels";

const SAMPLE_PROMPT = `You are a senior product designer and frontend engineer.

Goal:
- Design a premium loading screen for an AI prompt generation workspace.
- Keep the interface dark, precise, and system-like rather than playful.

Output requirements:
- Return a complete visual direction with hierarchy, spacing, and motion intent.
- Describe the loading state, the completed prompt state, and the transition between them.
- Keep the answer implementation-ready for a Next.js + Tailwind + Framer Motion stack.

Constraints:
- Avoid dashboard-card clutter.
- Use one warm accent and one cool accent only.
- Keep copy short and operator-focused.
- Make the layout work on desktop and mobile.`;

function PreviewSection({
  description,
  title,
  children
}: {
  description: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">State Preview</p>
        <h2 className="text-2xl font-medium tracking-tight text-white/92">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-white/56">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function StatusPreview() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SAMPLE_PROMPT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-4"
      >
        <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/52">
          Internal Route
        </p>
        <h1 className="max-w-4xl text-4xl font-medium tracking-tight text-white sm:text-5xl">
          Status previews for states that usually require a request
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-white/58 sm:text-[15px]">
          This page exists only to inspect post-request UI without calling the API. It is intentionally not linked
          anywhere in the site navigation.
        </p>
      </motion.div>

      <PreviewSection
        title="Generating"
        description="Preview of the generation loading screen shown while the workspace is transforming a raw request into a polished prompt."
      >
        <ProcessingStatusPanel targetModelLabel="Claude" variant="generating" />
      </PreviewSection>

      <PreviewSection
        title="Final Prompt"
        description="Preview of the final prompt panel after a successful response, with a realistic sample payload and active copy action."
      >
        <PromptResultPanel
          copied={copied}
          expertPrompt={SAMPLE_PROMPT}
          onCopy={handleCopy}
          targetModelLabel="ChatGPT"
        />
      </PreviewSection>
    </div>
  );
}
