import { BackgroundPathsBackdrop } from "@/components/ui/background-paths";
import { WorkspaceClientShell } from "@/components/ui/workspace-client-shell";

type WorkspacePageProps = {
  searchParams?: Promise<{
    session?: string | string[];
  }>;
};

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sessionParam = resolvedSearchParams?.session;
  const sessionKey = Array.isArray(sessionParam) ? sessionParam[0] : sessionParam;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <BackgroundPathsBackdrop className="opacity-70" />
      <div className="relative z-10">
        <WorkspaceClientShell key={sessionKey ?? "default"} />
      </div>
    </main>
  );
}
