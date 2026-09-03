import { AlertTriangle, RefreshCw } from "lucide-react";

interface GithubErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function GithubLoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8" aria-hidden="true">
        <div className="rounded-2xl border border-border/40 bg-muted/10 p-6 md:p-8">
          <div className="github-skeleton mb-5 h-3 w-40 rounded" />
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border/40 p-1">
            <div className="github-skeleton h-9 rounded-lg" />
            <div className="github-skeleton h-9 rounded-lg" />
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-xl border border-border/40 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="github-skeleton h-5 w-40 rounded" />
                  <div className="github-skeleton h-5 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-border/40 bg-muted/10 p-5"
            >
              <div className="github-skeleton size-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="github-skeleton h-3 w-20 rounded" />
                <div className="github-skeleton h-7 w-12 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-2xl bg-muted/15 p-6 md:p-8" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-center gap-4 rounded-xl p-4">
            <div className="github-skeleton size-12 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="github-skeleton h-3 w-28 rounded" />
              <div className="github-skeleton h-4 w-36 rounded" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading GitHub contributions</span>
    </div>
  );
}

export function GithubErrorState({ error, onRetry }: GithubErrorStateProps) {
  return (
    <div className="p-8 border border-red-500/20 bg-red-500/5 text-red-500 rounded-2xl max-w-md mx-auto text-center">
      <AlertTriangle className="mx-auto mb-4" size={32} />

      <p className="font-mono text-sm mb-4">{error}</p>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-mono text-xs font-bold hover:bg-red-600 transition-colors"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
