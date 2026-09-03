interface GithubAccountCardProps {
  label: string;
  username: string;
  avatarUrl: string;
  avatarAlt: string;
  labelClassName: string;
}

export function GithubAccountCard({
  label,
  username,
  avatarUrl,
  avatarAlt,
  labelClassName,
}: GithubAccountCardProps) {
  return (
    <div className="p-5 rounded-xl border border-border/40 bg-background/50 flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUrl}
          alt={avatarAlt}
          className="w-14 h-14 rounded-full border border-primary/20 object-cover shrink-0"
        />

        <div className="min-w-0">
          <span
            className={`text-[10px] font-mono font-bold block uppercase tracking-wider ${labelClassName}`}
          >
            {label}
          </span>

          <p className="text-sm font-mono font-bold text-foreground truncate">@{username}</p>
        </div>
      </div>
    </div>
  );
}
