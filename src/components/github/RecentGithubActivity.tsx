import { useMemo, useState } from "react";
import { GitBranch } from "lucide-react";
import {
  type GitHubContributionsActivities,
  type GitHubContributionsActivity,
} from "@lib/github-contributions";
import type { Language } from "@locales/dictionary";
import { GithubRepoActivityAccordion } from "./GithubRepoActivityAccordion";

interface RecentGithubActivityProps {
  activities: GitHubContributionsActivities;
  title: string;
  tabsLabel: string;
  privateTabLabel: string;
  publicTabLabel: string;
  emptyMessage: string;
  viewOnGithub: string;
  pushedAtLabel: string;
  language: Language;
}

interface GithubRepoActivityGroup {
  repoName: string;
  repoUrl: string;
  activities: GitHubContributionsActivity[];
}

function groupActivitiesByRepo(
  activities: GitHubContributionsActivity[],
): GithubRepoActivityGroup[] {
  const groups = new Map<string, GithubRepoActivityGroup>();

  for (const activity of activities) {
    const key = activity.repoName.toLowerCase();
    const group = groups.get(key);

    if (group) {
      group.activities.push(activity);
    } else {
      groups.set(key, {
        repoName: activity.repoName,
        repoUrl: activity.repoUrl,
        activities: [activity],
      });
    }
  }

  return [...groups.values()].sort((a, b) => {
    const latestA = Math.max(...a.activities.map((activity) => Date.parse(activity.pushedAt)));
    const latestB = Math.max(...b.activities.map((activity) => Date.parse(activity.pushedAt)));
    return latestB - latestA;
  });
}

export function RecentGithubActivity({
  activities,
  title,
  tabsLabel,
  privateTabLabel,
  publicTabLabel,
  emptyMessage,
  viewOnGithub,
  pushedAtLabel,
  language,
}: RecentGithubActivityProps) {
  const [activeTab, setActiveTab] = useState<keyof GitHubContributionsActivities>("private");
  const activityGroups = useMemo(
    () => groupActivitiesByRepo(activities[activeTab]),
    [activeTab, activities],
  );

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-border/40 bg-muted/10 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <GitBranch size={120} />
      </div>

      <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider mb-4 block">
        {title}
      </span>

      <div
        role="tablist"
        aria-label={tabsLabel}
        className="relative z-10 mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border/40 bg-background/50 p-1"
      >
        {(
          [
            ["private", privateTabLabel],
            ["public", publicTabLabel],
          ] as const
        ).map(([tab, label]) => {
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              id={`github-${tab}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`github-${tab}-panel`}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-mono font-semibold transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        id={`github-${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`github-${activeTab}-tab`}
      >
        {activityGroups.length > 0 ? (
          <div className="space-y-4">
            {activityGroups.map((group, index) => (
              <GithubRepoActivityAccordion
                key={group.repoName}
                repoName={group.repoName}
                repoUrl={group.repoUrl}
                activities={group.activities}
                defaultOpen={index < 3}
                viewOnGithub={viewOnGithub}
                pushedAtLabel={pushedAtLabel}
                language={language}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-mono">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
