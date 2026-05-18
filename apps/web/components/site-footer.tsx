"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/workspace") {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-black/10 px-4 py-5 text-sm text-white/60 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="transition hover:text-white">
          Prometheus AI
        </Link>
        <nav className="flex items-center gap-5">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Twitter
          </a>
          <Link href="/about" className="transition hover:text-white">
            A propos
          </Link>
        </nav>
      </div>
    </footer>
  );
}
