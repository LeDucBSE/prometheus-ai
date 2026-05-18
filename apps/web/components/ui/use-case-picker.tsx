"use client";

import {
  Bot,
  Code2,
  FileStack,
  FileText,
  GraduationCap,
  ImageIcon,
  LayoutTemplate,
  Megaphone,
  Search,
  Shapes,
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getSubcaseOptions,
  getUseCaseLabel,
  type UseCasePrimary,
  USE_CASE_OPTIONS
} from "@/lib/transform/use-cases";

const USE_CASE_ICONS: Record<UseCasePrimary, React.ComponentType<{ className?: string }>> = {
  text: FileText,
  image: ImageIcon,
  code: Code2,
  "website-app": LayoutTemplate,
  "ai-agent": Bot,
  research: Search,
  marketing: Megaphone,
  learning: GraduationCap,
  documents: FileStack,
  other: Shapes
};

export function UseCasePicker({
  primary,
  secondary,
  inferredHint,
  disabled = false,
  onPrimaryChange,
  onSecondaryChange,
  onClear
}: {
  primary: UseCasePrimary | "";
  secondary: string;
  inferredHint?: string | null;
  disabled?: boolean;
  onPrimaryChange: (primary: UseCasePrimary | "") => void;
  onSecondaryChange: (secondary: string) => void;
  onClear: () => void;
}) {
  const subcaseOptions = primary ? getSubcaseOptions(primary) : [];

  return (
    <div className="space-y-3">
      <div className="relative flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/38">Use case</span>
          {inferredHint ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#4ddbd1]/20 bg-[#4ddbd1]/10 px-2 py-0.5 text-[10px] text-[#9ef3dc]/90">
              <Sparkles className="h-3 w-3" />
              Auto
            </span>
          ) : null}
        </div>

        {primary ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className="absolute right-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/42 transition hover:bg-white/[0.05] hover:text-white/72 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {USE_CASE_OPTIONS.map((option) => {
          const Icon = USE_CASE_ICONS[option.id];
          const isActive = primary === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onPrimaryChange(isActive ? "" : option.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-2xl border px-3 py-2 transition",
                isActive
                  ? "border-white/18 bg-white/[0.09] text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
                  : "border-white/[0.06] bg-white/[0.02] text-white/62 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/84",
                disabled && "cursor-not-allowed opacity-45"
              )}
              aria-pressed={isActive}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl border",
                  isActive ? "border-white/14 bg-white/[0.08]" : "border-white/[0.05] bg-white/[0.03]"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {primary ? (
        <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-center text-[10px] uppercase tracking-[0.18em] text-white/34">
            {getUseCaseLabel(primary)} subtype
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {subcaseOptions.map((subcase) => {
              const isActive = secondary === subcase.id;

              return (
                <button
                  key={subcase.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSecondaryChange(subcase.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                    isActive
                      ? "border-white/16 bg-white/[0.1] text-white"
                      : "border-white/[0.05] bg-transparent text-white/55 hover:border-white/[0.1] hover:text-white/78",
                    disabled && "cursor-not-allowed opacity-45"
                  )}
                  aria-pressed={isActive}
                >
                  {subcase.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-xs leading-5 text-white/40">
          {inferredHint
            ? inferredHint
            : "Optional. Pick a category to steer the prompt, or leave empty and Prometheus will infer it from your request."}
        </p>
      )}
    </div>
  );
}
