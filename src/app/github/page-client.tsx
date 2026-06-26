"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { GitHubPulseActivity, GitHubPulseStats } from "@/lib/github-pulse";
import { GITHUB_PULSE_CACHE_KEY, GITHUB_PULSE_CACHE_TTL_MS } from "@/lib/github-pulse";
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

type GithubPulseData = {
  generatedAt: string;
  mainStats: GitHubPulseStats;
  latestActivity: GitHubPulseActivity[];
  workStats: GitHubPulseStats | null;
};

interface GithubPageClientProps {
  initialData?: GithubPulseData | null;
}

function isValidGithubPulseCache(value: unknown) {
  if (!value || typeof value !== "object") return false;

  const data = value as { cachedAt?: string; data?: GithubPulseData };
  if (!data.cachedAt || !data.data) return false;

  const cachedAtMs = Date.parse(data.cachedAt);
  if (Number.isNaN(cachedAtMs)) return false;

  return Date.now() - cachedAtMs < GITHUB_PULSE_CACHE_TTL_MS;
}

export default function GithubPageClient({ initialData }: GithubPageClientProps) {
  const { language, t } = useLanguage();
  const slideOffset = getNavDirection() * 50;

  const [mainStats, setMainStats] = useState<GitHubPulseStats | null>(
    initialData?.mainStats ?? null,
  );
  const [activities, setActivities] = useState<GitHubPulseActivity[]>(
    initialData?.latestActivity ?? [],
  );
  const [workStats, setWorkStats] = useState<GitHubPulseStats | null>(
    initialData?.workStats ?? null,
  );
  const loading = false;
  const [error, setError] = useState<string | null>(null);

  const applyPulseData = useCallback((data: GithubPulseData) => {
    setMainStats(data.mainStats);
    setActivities(Array.isArray(data.latestActivity) ? data.latestActivity : []);
    setWorkStats(data.workStats);
  }, []);

  const persistPulseData = useCallback((data: GithubPulseData) => {
    try {
      localStorage.setItem(
        GITHUB_PULSE_CACHE_KEY,
        JSON.stringify({
          cachedAt: new Date().toISOString(),
          data,
        }),
      );
    } catch {
      // Ignore storage quota / private browsing failures.
    }
  }, []);

  const loadData = useCallback(async () => {
    setError(null);

    try {
      const res = await fetch("/api/github/pulse");

      if (!res.ok) {
        throw new Error(`Failed to fetch GitHub pulse: ${res.status}`);
      }

      const data = (await res.json()) as GithubPulseData;
      applyPulseData(data);
      persistPulseData(data);
    } catch (err) {
      console.error(err);
      setError(t.github.error);
    }
  }, [applyPulseData, persistPulseData, t.github.error]);

  useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;

    try {
      const rawCache = localStorage.getItem(GITHUB_PULSE_CACHE_KEY);
      if (rawCache) {
        const parsed = JSON.parse(rawCache) as { cachedAt?: string; data?: GithubPulseData };
        if (isValidGithubPulseCache(parsed)) {
          timeoutId = window.setTimeout(() => {
            if (active && parsed.data) {
              applyPulseData(parsed.data);
            }
          }, 0);

          return () => {
            active = false;
            if (timeoutId) window.clearTimeout(timeoutId);
          };
        }
      }

      if (initialData) {
        persistPulseData(initialData);
      } else {
        timeoutId = window.setTimeout(() => {
          if (active) {
            loadData();
          }
        }, 0);
      }
    } catch {
      if (initialData) {
        persistPulseData(initialData);
      } else {
        timeoutId = window.setTimeout(() => {
          if (active) {
            loadData();
          }
        }, 0);
      }
    }

    return () => {
      active = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [applyPulseData, initialData, persistPulseData, loadData]);

  const slideDirectionVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      x: slideOffset,
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
      className="w-screen h-screen overflow-y-auto no-scrollbar flex items-start justify-center bg-background/50 border-r border-border/40 relative pt-6 pb-36 md:py-32"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent -z-10" />

      <motion.div
        variants={slideDirectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="text-left md:text-center max-w-3xl md:mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight flex items-center justify-start md:justify-center gap-3">
            <Activity size={36} className="text-primary animate-pulse shrink-0" />
            {t.github.title}
          </h2>

          <p className="text-base text-muted-foreground">{t.github.subtitle}</p>
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
                language={language}
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
