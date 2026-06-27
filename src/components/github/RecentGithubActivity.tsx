import React from "react";
import { ArrowRight, GitBranch, GitCommit } from "lucide-react";
import { motion } from "framer-motion";
import type { GitHubActivity } from "@/lib/github";
import type { Language } from "@/locales/dictionary";
import { formatDate } from "@/lib/date";

interface RecentGithubActivityProps {
  activities: GitHubActivity[];
  title: string;
  emptyMessage: string;
  viewOnGithub: string;
  pushedAtLabel: string;
  language: Language;
}

const getRepoDisplayName = (repoName: string) => {
  return repoName.includes("/") ? repoName.split("/").at(-1) : repoName;
};

const formatEventType = (type: string) => {
  return type.replace("Event", "");
};

const formatCommitSha = (commitSha: string) => {
  if (!commitSha || commitSha.startsWith("#")) {
    return commitSha;
  }

  return commitSha.length > 7 ? commitSha.slice(0, 7) : commitSha;
};

export function RecentGithubActivity({
  activities,
  title,
  emptyMessage,
  viewOnGithub,
  pushedAtLabel,
  language,
}: RecentGithubActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-2xl border border-border/40 bg-muted/10 backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <GitBranch size={120} />
      </div>

      <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-4 block">
        {title}
      </span>

      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={`${activity.repoName}-${activity.pushedAt}-${activity.type}`}
              className="p-4 rounded-xl border border-border/40 bg-background/50"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h3 className="text-base md:text-lg font-bold font-mono text-foreground truncate">
                    {getRepoDisplayName(activity.repoName)}
                  </h3>

                  <span className="text-[10px] font-mono text-muted-foreground">
                    {formatEventType(activity.type)}
                  </span>
                </div>

                <a
                  href={activity.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-primary hover:underline group shrink-0"
                >
                  {viewOnGithub}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>

              <div className="font-mono text-sm text-foreground/90 flex items-start gap-3">
                <div className="p-1 rounded bg-muted text-muted-foreground mt-0.5">
                  <GitCommit size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="line-clamp-2 text-foreground/80 leading-relaxed font-mono">
                    &ldquo;{activity.commitMessage}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    {activity.commitSha && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {formatCommitSha(activity.commitSha)}
                      </span>
                    )}

                    <span className="text-[10px] text-muted-foreground font-mono">
                      {pushedAtLabel}{" "}
                      {formatDate(activity.pushedAt, language, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground font-mono">{emptyMessage}</p>
      )}
    </motion.div>
  );
}
