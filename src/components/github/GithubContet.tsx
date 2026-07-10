"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@context/LanguageContext";
import type { GitHubPulseActivity, GitHubPulseStats } from "@lib/github-pulse";
import {
  GITHUB_PULSE_CACHE_KEY,
  GITHUB_PULSE_CACHE_TTL_MS,
  GITHUB_PULSE_LEGACY_CACHE_KEYS,
} from "@lib/github-pulse";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  RecentGithubActivity,
  GithubAccountsPanel,
  GithubLoadingState,
  GithubErrorState,
  GithubStatsGrid,
} from "@components/github";
import { Footer } from "@components/layout/Footer";

type GithubPulseData = {
  generatedAt: string;
  mainStats: GitHubPulseStats;
  latestActivity: GitHubPulseActivity[];
  workStats: GitHubPulseStats | null;
};

interface GithubContentProps {
  initialData?: GithubPulseData | null;
}

type GithubPulseCacheEntry = {
  cachedAt: string;
  data: GithubPulseData;
};

function parseGithubPulseCache(value: unknown): GithubPulseCacheEntry | null {
  if (!value || typeof value !== "object") return null;

  const data = value as { cachedAt?: string; data?: GithubPulseData };
  if (!data.cachedAt || !data.data) return null;

  const cachedAtMs = Date.parse(data.cachedAt);
  if (Number.isNaN(cachedAtMs)) return null;

  return {
    cachedAt: data.cachedAt,
    data: data.data,
  };
}

function isFreshGithubPulseCache(cache: GithubPulseCacheEntry) {
  return Date.now() - Date.parse(cache.cachedAt) < GITHUB_PULSE_CACHE_TTL_MS;
}

function readGithubPulseCache(): GithubPulseCacheEntry | null {
  for (const key of [GITHUB_PULSE_CACHE_KEY, ...GITHUB_PULSE_LEGACY_CACHE_KEYS]) {
    try {
      const rawCache = localStorage.getItem(key);
      if (!rawCache) continue;

      const parsed = parseGithubPulseCache(JSON.parse(rawCache));
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }

  return null;
}

export default function GithubContent({ initialData }: GithubContentProps) {
  const { language, t } = useLanguage();

  const [mainStats, setMainStats] = useState<GitHubPulseStats | null>(
    initialData?.mainStats ?? null,
  );
  const [activities, setActivities] = useState<GitHubPulseActivity[]>(
    initialData?.latestActivity ?? [],
  );
  const [workStats, setWorkStats] = useState<GitHubPulseStats | null>(
    initialData?.workStats ?? null,
  );
  const [loading, setLoading] = useState<boolean>(() => {
    return !initialData;
  });
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

  const loadData = useCallback(
    async (options?: { keepExistingData?: boolean }) => {
      setError(null);
      if (!options?.keepExistingData) {
        setLoading(true);
      }

      try {
        const res = await fetch("/api/github/pulse");

        if (!res.ok) {
          throw new Error(`Failed to fetch GitHub pulse: ${res.status}`);
        }

        const data = (await res.json()) as GithubPulseData;
        applyPulseData(data);
        persistPulseData(data);
        setLoading(false);
      } catch (err) {
        const cached = readGithubPulseCache();
        if (cached) {
          applyPulseData(cached.data);
        } else {
          console.error(err);
          setError(t.github.error);
        }
        setLoading(false);
      }
    },
    [applyPulseData, persistPulseData, t.github.error],
  );

  useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;

    try {
      const cached = readGithubPulseCache();
      if (cached) {
        timeoutId = window.setTimeout(() => {
          if (!active) return;

          applyPulseData(cached.data);
          setLoading(false);

          if (!isFreshGithubPulseCache(cached)) {
            void loadData({ keepExistingData: true });
          }
        }, 0);

        return () => {
          active = false;
          if (timeoutId) window.clearTimeout(timeoutId);
        };
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

  return (
    <section
      id="github"
      className="w-screen h-screen overflow-y-auto no-scrollbar flex flex-col items-start justify-center bg-background/50 border-r border-border/40 relative pt-6 pb-4 md:pt-32"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <div className="text-left md:text-center max-w-3xl md:mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight flex items-center justify-start md:justify-center gap-3">
            <Activity size={56} className="text-primary shrink-0 mr-2" />
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
      <Footer />
    </section>
  );
}
