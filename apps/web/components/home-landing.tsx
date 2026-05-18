"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ApiKeySetup } from "@/components/api-key-setup";
import { hasConfiguredApiCredentials } from "@/lib/api-credentials/storage";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeLanding() {
  const [isConfigured, setIsConfigured] = useState(() => hasConfiguredApiCredentials());

  return (
    <BackgroundPaths
      title="Prometheus AI"
      description="Transforme une intention brute en prompt expert. Connecte ta propre clé API, choisis ton fournisseur, et garde le contrôle de tes crédits."
      renderBelowDescription={
        <div className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center gap-8">
          <ApiKeySetup onConfiguredChange={setIsConfigured} />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={cn(
                "group relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-white/12 to-black/10 p-px backdrop-blur-lg",
                !isConfigured && "opacity-55"
              )}
            >
              <Button
                asChild={isConfigured}
                variant="ghost"
                disabled={!isConfigured}
                className="rounded-[1.15rem] border border-white/10 bg-white/95 px-8 py-6 text-lg font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:hover:translate-y-0 dark:bg-black/95 dark:text-white dark:hover:bg-black/100"
              >
                {isConfigured ? (
                  <Link href="/workspace">
                    <span>Get started</span>
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center">
                    Get started
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
            <p className="max-w-md text-center text-xs leading-5 text-white/42">
              {isConfigured
                ? "Ta clé est prête. Ouvre le workspace pour transformer ton premier prompt."
                : "Enregistre d'abord une clé API valide pour débloquer le workspace."}
            </p>
          </motion.div>
        </div>
      }
      hideDefaultCta
    />
  );
}
