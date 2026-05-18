"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { hasConfiguredApiCredentials } from "@/lib/api-credentials/storage";

const AnimatedAIChat = dynamic(
  () => import("@/components/ui/animated-ai-chat").then((module) => module.AnimatedAIChat),
  {
    ssr: false
  }
);

export function WorkspaceClientShell() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!hasConfiguredApiCredentials()) {
      router.replace("/");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-sm text-white/50">Vérification de la clé API…</p>
      </div>
    );
  }

  return <AnimatedAIChat />;
}
