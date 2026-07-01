import { motion, type Variants } from "framer-motion";
import { FolderCode, Star, Users } from "lucide-react";
import type { GitHubStats } from "@lib/github";
import { GithubMetricCard } from "./GithubMetricCard";

interface GithubStatsGridProps {
  mainStats: GitHubStats | null;
  workStats: GitHubStats | null;
  labels: {
    repos: string;
    stars: string;
    followers: string;
  };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export function GithubStatsGrid({ mainStats, workStats, labels }: GithubStatsGridProps) {
  const combinedRepos = (mainStats?.publicRepos ?? 0) + (workStats?.publicRepos ?? 0);

  const combinedStars = (mainStats?.stars ?? 0) + (workStats?.stars ?? 0);

  const combinedFollowers = (mainStats?.followers ?? 0) + (workStats?.followers ?? 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-6"
    >
      <GithubMetricCard
        label={labels.repos}
        value={combinedRepos}
        icon={FolderCode}
        variants={itemVariants}
        iconClassName="bg-blue-500/10 border-blue-500/20 text-blue-500"
        hoverClassName="hover:bg-blue-500/5 hover:border-blue-500/30"
      />

      <GithubMetricCard
        label={labels.stars}
        value={combinedStars}
        icon={Star}
        variants={itemVariants}
        iconClassName="bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
        hoverClassName="hover:bg-yellow-500/5 hover:border-yellow-500/30"
      />

      <GithubMetricCard
        label={labels.followers}
        value={combinedFollowers}
        icon={Users}
        variants={itemVariants}
        iconClassName="bg-purple-500/10 border-purple-500/20 text-purple-500"
        hoverClassName="hover:bg-purple-500/5 hover:border-purple-500/30"
      />
    </motion.div>
  );
}
