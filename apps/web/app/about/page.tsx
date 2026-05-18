import Link from "next/link";
import { ArrowRight, Orbit, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 pb-20 pt-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-white/60 transition hover:text-white"
        >
          Back to home
        </Link>

        <section className="border-t border-white/10 pt-10">
          <p className="text-sm uppercase tracking-[0.26em] text-white/45">A propos</p>
          <h1 className="mt-4 max-w-3xl font-[var(--font-serif)] text-4xl leading-tight text-white sm:text-5xl">
            Prometheus AI helps turn rough prompts into clearer instructions.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68">
            The product keeps the workflow simple: write fast, rewrite clean, and reuse the result.
          </p>
        </section>

        <section className="mt-12 border-t border-white/10 pt-10">
          <p className="text-sm uppercase tracking-[0.26em] text-white/45">What the product does</p>
          <h2 className="mt-4 max-w-xl font-[var(--font-serif)] text-3xl leading-tight text-white sm:text-4xl">
            One elegant front door, then one operational workspace.
          </h2>

          <div className="mt-10 grid gap-6 text-sm leading-7 text-white/68 sm:grid-cols-3">
            <div className="border-t border-white/10 pt-4">
              <Orbit className="h-5 w-5 text-[#f7b267]" />
              <p className="mt-4 text-white">Intent shaping</p>
              <p className="mt-2">
                Raw user prompts are turned into a cleaner, higher-signal structure before they
                reach the model layer.
              </p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <ShieldCheck className="h-5 w-5 text-[#2dd4bf]" />
              <p className="mt-4 text-white">Server-first execution</p>
              <p className="mt-2">
                API calls and secrets stay behind the interface so the product can scale without
                leaking complexity into the client.
              </p>
            </div>
            <div className="border-t border-white/10 pt-4">
              <Sparkles className="h-5 w-5 text-white/80" />
              <p className="mt-4 text-white">Useful output</p>
              <p className="mt-2">
                The response panel is designed for direct reuse, editing, and iteration rather than
                decorative AI copy.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 border-t border-white/10 pt-10">
          <p className="text-sm uppercase tracking-[0.26em] text-white/45">Next step</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl font-[var(--font-serif)] text-3xl leading-tight text-white sm:text-4xl">
              Open the workspace and start feeding Prometheus AI your first prompt.
            </h2>
            <Link
              href="/workspace"
              className="inline-flex items-center gap-3 text-base font-medium text-[#f7b267] transition hover:text-[#fcc27f]"
            >
              Go to the workspace
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
