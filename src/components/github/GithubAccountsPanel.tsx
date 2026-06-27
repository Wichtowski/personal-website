import { motion } from "framer-motion";
import type { GitHubStats } from "@/lib/github";
import { GithubAccountCard } from "./GithubAccountCard";
import Link from "next/link";

interface GithubAccountsPanelProps {
  mainStats: GitHubStats | null;
  workStats: GitHubStats | null;
  labels: {
    primaryAccountLabel: string;
    workAccountTag: string;
  };
}

export function GithubAccountsPanel({ mainStats, workStats, labels }: GithubAccountsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6 md:p-8 rounded-2xl  bg-muted/15 backdrop-blur-sm flex flex-col justify-between"
    >
      <div className="space-y-4 gap-3 flex flex-col">
        <Link href="https://github.com/Wichtowski" target="_blank" rel="noopener noreferrer">
          <GithubAccountCard
            label={labels.primaryAccountLabel}
            username="Wichtowski"
            avatarUrl={mainStats?.avatarUrl}
            avatarAlt="Personal Account"
            labelClassName="text-primary"
            fallbackClassName="bg-primary/10 border-primary/20"
          />
        </Link>

        <Link
          href="https://github.com/oskar-wichtowski-wttech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubAccountCard
            label={labels.workAccountTag}
            username="oskar-wichtowski-wttech"
            avatarUrl={workStats?.avatarUrl}
            avatarAlt="Work Account"
            labelClassName="text-blue-500"
            fallbackClassName="bg-blue-500/10 border-blue-500/20"
          />
        </Link>
      </div>
    </motion.div>
  );
}
