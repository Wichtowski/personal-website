import { env } from "@lib/env";

export interface GitHubPulseStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
}

export interface GitHubPulseActivity {
  repoName: string;
  repoUrl: string;
  commitMessage: string;
  commitSha: string;
  pushedAt: string;
  type: string;
  payloadAction?: string;
}

interface GitHubRepo {
  name: string;
  pushed_at: string | null;
  stargazers_count?: number;
}

interface GitHubCommitListItem {
  sha: string;
  commit: {
    message: string;
  };
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    action?: string;
    ref?: string;
    ref_type?: string;
    number?: number;
    head?: string;
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    pull_request?: {
      title?: string;
      head?: {
        sha?: string;
      };
    };
    issue?: {
      title?: string;
    };
  };
}

interface GitHubCommitResponse {
  sha: string;
  commit?: {
    message?: string;
  };
}

const MAIN_USERNAME = "Wichtowski";
const WORK_USERNAME = "oskar-wichtowski-wttech";

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "oskar-wichtowski-portfolio",
      ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API failed: ${path} -> ${res.status}`);
  }

  return res.json() as Promise<T>;
}

function parseRepoFullName(repoName: string) {
  const [owner, repo] = repoName.split("/");
  if (!owner || !repo) {
    return null;
  }

  return { owner, repo };
}

async function fetchCommitDetails(repoName: string, ref: string) {
  const repo = parseRepoFullName(repoName);
  if (!repo || !ref) {
    return null;
  }

  const commit = await githubFetch<GitHubCommitResponse>(
    `/repos/${repo.owner}/${repo.repo}/commits/${encodeURIComponent(ref)}`,
  );

  return {
    sha: commit.sha,
    message: commit.commit?.message?.split("\n")[0] || "Active development",
  };
}

async function fetchGitHubStats(username: string): Promise<GitHubPulseStats> {
  const profile = await githubFetch<{
    login: string;
    name?: string;
    avatar_url: string;
    public_repos?: number;
    followers?: number;
    following?: number;
  }>(`/users/${username}`);

  const repos = await githubFetch<GitHubRepo[]>(`/users/${username}/repos?per_page=100&type=owner`);
  const stars = repos.reduce((acc, repo) => acc + (repo.stargazers_count ?? 0), 0);

  return {
    username,
    name: profile.name || profile.login,
    avatarUrl: profile.avatar_url,
    publicRepos: profile.public_repos ?? 0,
    followers: profile.followers ?? 0,
    following: profile.following ?? 0,
    stars,
  };
}

async function fetchRepoCommitActivities(
  username: string,
  limit: number,
  excludeRepos: Set<string>,
): Promise<GitHubPulseActivity[]> {
  const repos = await githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&sort=pushed&direction=desc&type=owner`,
  );

  const activities: GitHubPulseActivity[] = [];

  for (const repo of repos) {
    const repoName = `${username}/${repo.name}`;
    if (excludeRepos.has(repoName) || !repo.pushed_at) continue;

    const commits = await githubFetch<GitHubCommitListItem[]>(
      `/repos/${repoName}/commits?per_page=1`,
    ).catch(() => null);

    const latestCommit = commits?.[0];
    if (!latestCommit) continue;

    activities.push({
      repoName,
      repoUrl: `https://github.com/${repoName}`,
      commitMessage: latestCommit.commit.message.split("\n")[0] || "Active development",
      commitSha: latestCommit.sha,
      pushedAt: repo.pushed_at,
      type: "PushEvent",
    });

    if (activities.length >= limit) break;
  }

  return activities;
}

async function fetchRecentRepoActivities(
  username: string,
  limit = 3,
  maxPages = 3,
): Promise<GitHubPulseActivity[]> {
  const supportedTypes = new Set(["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent"]);

  const seenRepos = new Set<string>();
  const activities: GitHubPulseActivity[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const events = await githubFetch<GitHubEvent[]>(
      `/users/${username}/events/public?per_page=30&page=${page}`,
    );

    for (const event of events) {
      if (!supportedTypes.has(event.type)) continue;
      if (seenRepos.has(event.repo.name)) continue;

      seenRepos.add(event.repo.name);
      activities.push(await formatGitHubEvent(event));

      if (activities.length >= limit) return activities;
    }

    if (events.length < 30) break;
  }

  if (activities.length < limit) {
    const fallbackActivities = await fetchRepoCommitActivities(
      username,
      limit - activities.length,
      seenRepos,
    );
    activities.push(...fallbackActivities);
  }

  return activities;
}

export const GITHUB_PULSE_CACHE_KEY = "github-pulse-cache-v1";
export const GITHUB_PULSE_LEGACY_CACHE_KEYS = ["github-pulse-cache"];
export const GITHUB_PULSE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type GitHubPulseResult = {
  generatedAt: string;
  mainStats: GitHubPulseStats;
  latestActivity: GitHubPulseActivity[];
  workStats: GitHubPulseStats | null;
};

let _serverCache: { data: GitHubPulseResult; cachedAt: number } | null = null;

export async function buildGitHubPulse(): Promise<GitHubPulseResult> {
  if (_serverCache && Date.now() - _serverCache.cachedAt < GITHUB_PULSE_CACHE_TTL_MS) {
    return _serverCache.data;
  }

  const [mainStats, latestActivity, workStats] = await Promise.all([
    fetchGitHubStats(MAIN_USERNAME),
    fetchRecentRepoActivities(MAIN_USERNAME, 3),
    fetchGitHubStats(WORK_USERNAME).catch(() => null),
  ]);

  const result: GitHubPulseResult = {
    generatedAt: new Date().toISOString(),
    mainStats,
    latestActivity,
    workStats,
  };

  _serverCache = { data: result, cachedAt: Date.now() };

  return result;
}

async function formatGitHubEvent(event: GitHubEvent): Promise<GitHubPulseActivity> {
  const repoName = event.repo.name;
  let commitMessage = "Active development";
  let commitSha = "";
  let refToResolve: string | null = null;

  if (event.type === "PushEvent") {
    refToResolve = event.payload?.head ?? event.payload?.commits?.[0]?.sha ?? null;
  }

  if (event.type === "PullRequestEvent") {
    commitMessage = `${event.payload?.action ?? "Updated"} pull request: ${
      event.payload?.pull_request?.title ?? ""
    }`;
    commitSha = `#${event.payload?.number ?? ""}`;
    refToResolve = event.payload?.pull_request?.head?.sha ?? null;
  }

  if (event.type === "IssuesEvent") {
    commitMessage = `${event.payload?.action ?? "Updated"} issue: ${
      event.payload?.issue?.title ?? ""
    }`;
    commitSha = `#${event.payload?.number ?? ""}`;
  }

  if (event.type === "CreateEvent") {
    commitMessage = `Created ${event.payload?.ref_type ?? "repository"}: ${
      event.payload?.ref ?? repoName
    }`;
    refToResolve = event.payload?.ref ?? null;
  }

  if (refToResolve) {
    const commitDetails = await fetchCommitDetails(repoName, refToResolve);
    if (commitDetails) {
      commitMessage = commitDetails.message;
      commitSha = commitDetails.sha;
    } else if (event.type === "PushEvent" && event.payload?.commits?.length) {
      commitMessage = event.payload.commits[0].message;
      commitSha = event.payload.commits[0].sha;
    }
  }

  return {
    repoName,
    repoUrl: `https://github.com/${repoName}`,
    commitMessage,
    commitSha,
    pushedAt: event.created_at,
    type: event.type,
    payloadAction: event.payload?.action,
  };
}
