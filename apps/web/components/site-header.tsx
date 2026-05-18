"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function navLinkClassName(isActive: boolean) {
  return cn(
    "inline-flex items-center rounded-full px-3 py-1.5 text-sm transition duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0",
    isActive ? "bg-white/[0.08] text-white" : "text-white/58 hover:bg-white/[0.05] hover:text-white/82"
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/32 via-black/10 to-transparent" />
      <div className="pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center rounded-full px-2 py-1.5 text-[0.95rem] font-medium tracking-[0.01em] text-white/78 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-0"
        >
          Prometheus AI
        </Link>

        <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl">
          <Link href="/" aria-current={isHome ? "page" : undefined} className={navLinkClassName(isHome)}>
            Home
          </Link>
          <button
            type="button"
            onClick={handleGoHome}
            className={navLinkClassName(false)}
            title="Retour à l'accueil pour modifier la clé API"
          >
            New
          </button>
        </div>
      </div>
    </header>
  );
}
