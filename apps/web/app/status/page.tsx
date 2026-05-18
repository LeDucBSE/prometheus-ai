import type { Metadata } from "next";
import { StatusPreview } from "@/components/status-preview";
import { BackgroundPathsBackdrop } from "@/components/ui/background-paths";

export const metadata: Metadata = {
  title: "Status Preview | Prometheus AI",
  description: "Internal preview page for request-only UI states.",
  robots: {
    index: false,
    follow: false
  }
};

export default function StatusPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <BackgroundPathsBackdrop className="opacity-70" />
      <StatusPreview />
    </main>
  );
}
