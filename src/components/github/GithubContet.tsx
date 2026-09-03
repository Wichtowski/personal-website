"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@context/LanguageContext";
import type {
  GitHubContributionsActivities,
  GitHubContributionsActivity,
  GitHubContributionsStats,
} from "@lib/github-contributions";
import {
  GITHUB_CONTRIBUTIONS_CACHE_KEY,
  GITHUB_CONTRIBUTIONS_CACHE_TTL_MS,
  GITHUB_CONTRIBUTIONS_LEGACY_CACHE_KEYS,
  isOutsideGitHubActivityScope,
  isWithinGitHubContributionsWindow,
} from "@lib/github-contributions";
import { Activity } from "lucide-react";
import {
  RecentGithubActivity,
  GithubAccountsPanel,
  GithubLoadingState,
  GithubErrorState,
  GithubStatsGrid,
} from "@components/github";
import { Footer } from "@components/layout/Footer";

type GithubContributionsData = {
  generatedAt: string;
  mainStats: GitHubContributionsStats | null;
  activities?: GitHubContributionsActivities;
  latestActivity?: GitHubContributionsActivity[];
  workStats: GitHubContributionsStats | null;
  partial?: boolean;
};

interface GithubContentProps {
  initialData?: GithubContributionsData | null;
}

type GithubContributionsCacheEntry = {
  cachedAt: string;
  data: GithubContributionsData;
};

function parseGithubContributionsCache(value: unknown): GithubContributionsCacheEntry | null {
  if (!value || typeof value !== "object") return null;

  const data = value as { cachedAt?: string; data?: GithubContributionsData };
  if (!data.cachedAt || !data.data) return null;

  const cachedAtMs = Date.parse(data.cachedAt);
  if (Number.isNaN(cachedAtMs)) return null;

  return {
    cachedAt: data.cachedAt,
    data: data.data,
  };
}

function isFreshGithubContributionsCache(cache: GithubContributionsCacheEntry) {
  return Date.now() - Date.parse(cache.cachedAt) < GITHUB_CONTRIBUTIONS_CACHE_TTL_MS;
}

function getActivitySections(data: GithubContributionsData): GitHubContributionsActivities {
  if (data.activities) {
    return {
      private: Array.isArray(data.activities.private)
        ? data.activities.private.filter((activity) =>
            isWithinGitHubContributionsWindow(activity.pushedAt),
          )
        : [],
      public: Array.isArray(data.activities.public)
        ? data.activities.public.filter((activity) =>
            isWithinGitHubContributionsWindow(activity.pushedAt),
          )
        : [],
    };
  }

  const legacyActivity = Array.isArray(data.latestActivity) ? data.latestActivity : [];

  return {
    private: legacyActivity.filter(
      (activity) =>
        isWithinGitHubContributionsWindow(activity.pushedAt) &&
        !isOutsideGitHubActivityScope(activity.repoName) &&
        activity.type === "PushEvent",
    ),
    public: legacyActivity.filter(
      (activity) =>
        isWithinGitHubContributionsWindow(activity.pushedAt) &&
        isOutsideGitHubActivityScope(activity.repoName),
    ),
  };
}

function mergeContributionsData(
  data: GithubContributionsData,
  cachedData: GithubContributionsData,
): GithubContributionsData {
  const incomingActivities = getActivitySections(data);
  const cachedActivities = getActivitySections(cachedData);

  return {
    ...data,
    mainStats: data.mainStats ?? cachedData.mainStats,
    workStats: data.workStats ?? cachedData.workStats,
    activities: {
      private:
        incomingActivities.private.length > 0
          ? incomingActivities.private
          : cachedActivities.private,
      public:
        incomingActivities.public.length > 0 ? incomingActivities.public : cachedActivities.public,
    },
  };
}

function readGithubContributionsCache(): GithubContributionsCacheEntry | null {
  for (const key of [GITHUB_CONTRIBUTIONS_CACHE_KEY, ...GITHUB_CONTRIBUTIONS_LEGACY_CACHE_KEYS]) {
    try {
      const rawCache = localStorage.getItem(key);
      if (!rawCache) continue;

      const parsed = parseGithubContributionsCache(JSON.parse(rawCache));
      if (parsed) return parsed;
    } catch {
      continue;
    }
  }

  return null;
}

export default function GithubContent({ initialData }: GithubContentProps) {
  const { language, t } = useLanguage();

  const [mainStats, setMainStats] = useState<GitHubContributionsStats | null>(
    initialData?.mainStats ?? null,
  );
  const [activities, setActivities] = useState<GitHubContributionsActivities>(
    initialData ? getActivitySections(initialData) : { private: [], public: [] },
  );
  const [workStats, setWorkStats] = useState<GitHubContributionsStats | null>(
    initialData?.workStats ?? null,
  );
  const [loading, setLoading] = useState<boolean>(() => {
    return !initialData;
  });
  const [error, setError] = useState<string | null>(null);

  const applyContributionsData = useCallback((data: GithubContributionsData) => {
    setMainStats(data.mainStats);
    setActivities(getActivitySections(data));
    setWorkStats(data.workStats);
  }, []);

  const persistContributionsData = useCallback((data: GithubContributionsData) => {
    try {
      localStorage.setItem(
        GITHUB_CONTRIBUTIONS_CACHE_KEY,
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
        const res = await fetch("/api/github/contributions");

        if (!res.ok) {
          throw new Error(`Failed to fetch GitHub Contributions: ${res.status}`);
        }

        const data = (await res.json()) as GithubContributionsData;
        const cached = readGithubContributionsCache();
        const resolvedData =
          data.partial && cached ? mergeContributionsData(data, cached.data) : data;
        applyContributionsData(resolvedData);
        if (!data.partial) {
          persistContributionsData(resolvedData);
        }
        setLoading(false);
      } catch (err) {
        const cached = readGithubContributionsCache();
        if (cached) {
          applyContributionsData(cached.data);
        } else {
          console.error(err);
          setError(t.github.error);
        }
        setLoading(false);
      }
    },
    [applyContributionsData, persistContributionsData, t.github.error],
  );

  useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;

    try {
      const cached = readGithubContributionsCache();
      if (cached) {
        timeoutId = window.setTimeout(() => {
          if (!active) return;

          applyContributionsData(cached.data);
          setLoading(false);

          if (!isFreshGithubContributionsCache(cached)) {
            void loadData({ keepExistingData: true });
          }
        }, 0);

        return () => {
          active = false;
          if (timeoutId) window.clearTimeout(timeoutId);
        };
      }

      if (initialData) {
        persistContributionsData(initialData);
      } else {
        timeoutId = window.setTimeout(() => {
          if (active) {
            loadData();
          }
        }, 0);
      }
    } catch {
      if (initialData) {
        persistContributionsData(initialData);
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
  }, [applyContributionsData, initialData, persistContributionsData, loadData]);

  return (
    <section
      id="contributions"
      className="w-screen h-screen overflow-y-auto no-scrollbar flex flex-col items-start justify-start bg-background/50 border-r border-border/40 relative pt-24 pb-4 md:pt-32"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent -z-10" />

      <div className="max-w-7xl mx-auto mb-12 px-6 w-full md:mb-20">
        <div className="text-left md:text-center max-w-3xl md:mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 tracking-tight flex items-center justify-start md:justify-center gap-3">
            <Activity size={56} className="text-primary shrink-0 mr-2" />
            {t.github.title}
          </h2>
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
                title={t.github.latestActivity}
                tabsLabel={t.github.activityTabsLabel}
                privateTabLabel={t.github.privateActivity}
                publicTabLabel={t.github.publicActivity}
                emptyMessage={t.github.noRecentActivity}
                viewOnGithub={t.github.viewOnGithub}
                pushedAtLabel={t.github.pushedAt}
                language={language}
              />

              {(mainStats || workStats) && (
                <GithubStatsGrid
                  mainStats={mainStats}
                  workStats={workStats}
                  labels={{
                    repos: t.github.repos,
                    stars: t.github.stars,
                    followers: t.github.followers,
                  }}
                />
              )}
            </div>

            <GithubAccountsPanel
              labels={{
                personalGithubAccount: t.github.personalGithubAccount,
                workGithubAccount: t.github.workGithubAccount,
                gitlabAccount: t.github.gitlabAccount,
              }}
            />
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
}
