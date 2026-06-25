interface GithubAccountCardProps {
  label: string;
  username: string;
  avatarUrl?: string;
  avatarAlt: string;
  labelClassName: string;
  fallbackClassName: string;
}

export function GithubAccountCard({
  label,
  username,
  avatarUrl,
  avatarAlt,
  labelClassName,
  fallbackClassName,
}: GithubAccountCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={avatarAlt}
            className="w-8 h-8 rounded-full border border-primary/20 shrink-0"
          />
        ) : (
          <div className={`w-8 h-8 rounded-full border shrink-0 ${fallbackClassName}`} />
        )}

        <div className="min-w-0">
          <span className={`text-[9px] font-mono font-bold block uppercase tracking-wider ${labelClassName}`}>
            {label}
          </span>

          <p className="text-xs font-mono font-bold text-foreground truncate">
            @{username}
          </p>
        </div>
      </div>
    </div>
  );
}
