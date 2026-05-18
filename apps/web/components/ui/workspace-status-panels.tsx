"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type ProcessingVariant = "generating" | "transcribing";

const STEPS: Record<ProcessingVariant, string[]> = {
  generating: ["Reading your intent", "Structuring the prompt", "Calibrating output"],
  transcribing: ["Cleaning the audio", "Decoding speech", "Merging into workspace"]
};

export function ProcessingStatusPanel({
  targetModelLabel,
  variant
}: {
  targetModelLabel: string;
  variant: ProcessingVariant;
}) {
  const steps = STEPS[variant];
  const lastStep = variant === "generating" ? `Calibrating for ${targetModelLabel}` : steps[2];
  const resolvedSteps = [steps[0], steps[1], lastStep] as string[];
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveStep((s) => (s + 1) % resolvedSteps.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [resolvedSteps.length]);

  return (
    <motion.div
      className="flex flex-col items-center gap-4 py-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <motion.span
        className="block h-1.5 w-1.5 rounded-full bg-white/50"
        animate={{ scale: [1, 1.7, 1], opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 1.6, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={activeStep}
          className="text-sm text-white/40"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {resolvedSteps[activeStep]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

export function PromptResultPanel({
  copied,
  expertPrompt,
  onCopy,
  targetModelLabel
}: {
  copied?: boolean;
  expertPrompt: string;
  onCopy?: () => void;
  targetModelLabel: string;
}) {
  return (
    <motion.div
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 shadow-2xl backdrop-blur-2xl"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/35">Final Prompt</p>
          <h2 className="mt-2 text-xl font-medium text-white/92">Expert prompt ready</h2>
          <p className="mt-1 text-sm text-white/50">
            Copy it and paste it directly into {targetModelLabel}.
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.08]"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/[0.05] bg-[#09090B] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/30">{`Optimized for ${targetModelLabel}`}</div>
        <pre className="max-h-[540px] overflow-auto whitespace-pre-wrap break-words pr-1 text-sm leading-7 text-white/86">
          {expertPrompt}
        </pre>
      </div>
    </motion.div>
  );
}
