import { AlertTriangle, RefreshCw } from "lucide-react";

interface GithubErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function GithubLoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-40 bg-muted/40 animate-pulse rounded-2xl border border-border/40" />
        <div className="h-64 bg-muted/40 animate-pulse rounded-2xl border border-border/40" />
      </div>

      <div className="h-[432px] bg-muted/40 animate-pulse rounded-2xl border border-border/40" />
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
