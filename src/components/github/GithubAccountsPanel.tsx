import { motion } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import { GithubAccountCard } from "./GithubAccountCard";

interface GithubAccountsPanelProps {
  mainStats: GitHubStats | null;
  workStats: GitHubStats | null;
  labels: {
    primaryAccountLabel: string;
    workAccountTag: string;
  };
}

export function GithubAccountsPanel({
  mainStats,
  workStats,
  labels,
}: GithubAccountsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 md:p-8 rounded-2xl border border-border/40 bg-muted/15 backdrop-blur-sm flex flex-col justify-between"
    >
      <div className="space-y-4">
        <GithubAccountCard
          label={labels.primaryAccountLabel}
          username="Wichtowski"
          avatarUrl={mainStats?.avatarUrl}
          avatarAlt="Personal Account"
          labelClassName="text-primary"
          fallbackClassName="bg-primary/10 border-primary/20"
        />

        <GithubAccountCard
          label={labels.workAccountTag}
          username="oskar-wichtowski-wttech"
          avatarUrl={workStats?.avatarUrl}
          avatarAlt="Work Account"
          labelClassName="text-blue-500"
          fallbackClassName="bg-blue-500/10 border-blue-500/20"
        />
      </div>
    </motion.div>
  );
}
