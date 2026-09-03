import { FolderCode, Star, Users } from "lucide-react";
import type { GitHubContributionsStats } from "@lib/github-contributions";
import { GithubMetricCard } from "./GithubMetricCard";

interface GithubStatsGridProps {
  mainStats: GitHubContributionsStats | null;
  workStats: GitHubContributionsStats | null;
  labels: {
    repos: string;
    stars: string;
    followers: string;
  };
}

export function GithubStatsGrid({ mainStats, workStats, labels }: GithubStatsGridProps) {
  const combinedRepos = (mainStats?.publicRepos ?? 0) + (workStats?.publicRepos ?? 0);

  const combinedStars = (mainStats?.stars ?? 0) + (workStats?.stars ?? 0);

  const combinedFollowers = (mainStats?.followers ?? 0) + (workStats?.followers ?? 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <GithubMetricCard
        label={labels.repos}
        value={combinedRepos}
        icon={FolderCode}
        iconClassName="bg-blue-500/10 border-blue-500/20 text-blue-500"
        hoverClassName="hover:bg-blue-500/5 hover:border-blue-500/30"
      />

      <GithubMetricCard
        label={labels.stars}
        value={combinedStars}
        icon={Star}
        iconClassName="bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
        hoverClassName="hover:bg-yellow-500/5 hover:border-yellow-500/30"
      />

      <GithubMetricCard
        label={labels.followers}
        value={combinedFollowers}
        icon={Users}
        iconClassName="bg-purple-500/10 border-purple-500/20 text-purple-500"
        hoverClassName="hover:bg-purple-500/5 hover:border-purple-500/30"
      />
    </div>
  );
}
