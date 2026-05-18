"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + path.id * 0.35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPathsBackdrop({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}

export function BackgroundPaths({
  title = "Prometheus AI",
  description = "Shape raw intent into a production-grade prompt, then move directly into a focused workspace built for iteration.",
  ctaLabel = "Get started",
  ctaHref = "/workspace",
  renderBelowDescription,
  hideDefaultCta = false
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  renderBelowDescription?: React.ReactNode;
  hideDefaultCta?: boolean;
}) {
  const words = title.split(" ");

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <BackgroundPathsBackdrop />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(247,178,103,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.14),transparent_22%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-20 pt-28 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <p className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
            Prompt Intelligence Workspace
          </p>

          <h1 className="text-5xl font-bold tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-[8.5rem]">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="mr-4 inline-block last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.12 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className="inline-block bg-gradient-to-r from-white via-white to-white/65 bg-clip-text text-transparent"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.5 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/68 sm:text-lg"
          >
            {description}
          </motion.p>

          {renderBelowDescription}

          {!hideDefaultCta ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.7 }}
              className="mt-10"
            >
            <div className="group relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-white/12 to-black/10 p-px backdrop-blur-lg">
              <Button
                asChild
                variant="ghost"
                className="rounded-[1.15rem] border border-white/10 bg-white/95 px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white dark:bg-black/95 dark:text-white dark:hover:bg-black/100"
              >
                <Link href={ctaHref}>
                  <span>{ctaLabel}</span>
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              </div>
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
