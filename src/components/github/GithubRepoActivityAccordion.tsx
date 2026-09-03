import { ArrowRight, ChevronDown, GitCommit } from "lucide-react";
import { formatDate } from "@lib/date";
import {
  getGitHubActivityDisplayName,
  type GitHubContributionsActivity,
} from "@lib/github-contributions";
import type { Language } from "@locales/dictionary";

interface GithubRepoActivityAccordionProps {
  repoName: string;
  repoUrl: string;
  activities: GitHubContributionsActivity[];
  defaultOpen?: boolean;
  viewOnGithub: string;
  pushedAtLabel: string;
  language: Language;
}

const publicEventPriority: Record<string, number> = {
  PushEvent: 0,
  IssuesEvent: 1,
  IssueCommentEvent: 2,
  PullRequestReviewCommentEvent: 2,
  CommitCommentEvent: 2,
  PullRequestEvent: 3,
  CreateEvent: 3,
};

function formatEventType(type: string) {
  return type.replace("Event", "").replaceAll(/([a-z])([A-Z])/g, "$1 $2");
}

function formatCommitSha(commitSha: string) {
  if (!commitSha || commitSha.startsWith("#")) {
    return commitSha;
  }

  return commitSha.length > 7 ? commitSha.slice(0, 7) : commitSha;
}

export function GithubRepoActivityAccordion({
  repoName,
  repoUrl,
  activities,
  defaultOpen = false,
  viewOnGithub,
  pushedAtLabel,
  language,
}: GithubRepoActivityAccordionProps) {
  const sortedActivities = [...activities]
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, 3)
    .sort((a, b) => {
      const priorityDifference =
        (publicEventPriority[a.type] ?? Number.MAX_SAFE_INTEGER) -
        (publicEventPriority[b.type] ?? Number.MAX_SAFE_INTEGER);

      return priorityDifference || Date.parse(b.pushedAt) - Date.parse(a.pushedAt);
    });

  return (
    <details
      open={defaultOpen || undefined}
      className="group rounded-xl border border-border/40 bg-background/50"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:content-none">
        <div className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold font-mono text-foreground md:text-lg">
            {getGitHubActivityDisplayName(repoName)}
          </span>
        </div>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
          {sortedActivities.length}
        </span>

        <ChevronDown
          size={18}
          className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="space-y-3 border-t border-border/40 p-4">
        {sortedActivities.map((activity, index) => (
          <div
            key={
              activity.eventId ??
              `${activity.repoName}-${activity.pushedAt}-${activity.type}-${index}`
            }
            className="rounded-lg border border-border/30 bg-muted/10 p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wider">
                {formatEventType(activity.type)}
              </span>

              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-mono font-bold text-primary hover:underline group/link"
              >
                {viewOnGithub}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover/link:translate-x-1"
                />
              </a>
            </div>

            <div className="flex items-start gap-3 font-mono text-sm text-foreground/90">
              <div className="mt-0.5 rounded bg-muted p-1 text-muted-foreground">
                <GitCommit size={14} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground/80 leading-relaxed font-mono">
                  &ldquo;{activity.commitMessage}&rdquo;
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activity.commitSha && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
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
    </details>
  );
}
