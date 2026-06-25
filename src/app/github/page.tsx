"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { GitHubStats, GitHubActivity } from "@/lib/github";
import { Activity } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { getNavDirection } from "@/lib/navigation";
import { 
  RecentGithubActivity, 
  GithubAccountsPanel,
  GithubLoadingState,
  GithubErrorState,
  GithubStatsGrid,
} from "@/components/github";

export default function GithubPage() {
  const { t } = useLanguage();

  const [mainStats, setMainStats] = useState<GitHubStats | null>(null);
  const [activities, setActivities] = useState<GitHubActivity[]>([]);
  const [workStats, setWorkStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/github/pulse");

      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub pulse: ${res.status}`);
      }

      const data = await res.json() as {
        mainStats: GitHubStats;
        latestActivity: GitHubActivity[];
        workStats: GitHubStats | null;
      };

      setMainStats(data.mainStats);
      setActivities(Array.isArray(data.latestActivity) ? data.latestActivity : []);
      setWorkStats(data.workStats);
    } catch (err) {
      console.error(err);
      setError(t.github.error);
    } finally {
      setLoading(false);
    }
  }, [t.github.error]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const slideDirectionVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      get x() {
        return typeof window !== "undefined" ? getNavDirection() * 50 : 50;
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 60 },
    },
  };

  return (
    <section
      id="github"
      className="w-screen h-screen overflow-y-auto flex items-center justify-center bg-background/50 border-r border-border/40 relative py-32"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent -z-10" />

      <motion.div
        variants={slideDirectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight flex items-center justify-center gap-3">
            <Activity size={36} className="text-primary animate-pulse shrink-0" />
            {t.github.title}
          </h2>

          <p className="text-base text-muted-foreground">
            {t.github.subtitle}
          </p>
        </div>

        {loading ? (
          <GithubLoadingState />
        ) : error ? (
          <GithubErrorState error={error} onRetry={loadData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <RecentGithubActivity
                activities={activities}
                title={t.github.lastPushedRepo}
                emptyMessage={t.github.noRecentActivity}
                viewOnGithub={t.github.viewOnGithub}
                pushedAtLabel={t.github.pushedAt}
              />

              <GithubStatsGrid
                mainStats={mainStats}
                workStats={workStats}
                labels={{
                  repos: t.github.repos,
                  stars: t.github.stars,
                  followers: t.github.followers,
                }}
              />
            </div>

            <GithubAccountsPanel
              mainStats={mainStats}
              workStats={workStats}
              labels={{
                primaryAccountLabel: t.github.primaryAccountLabel,
                workAccountTag: t.github.workAccountTag,
              }}
            />
          </div>
        )}
      </motion.div>
    </section>
  );
}