import { env } from "@lib/env";

export interface GitHubContributionsStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
}

export interface GitHubContributionsActivity {
  eventId?: string;
  repoName: string;
  repoUrl: string;
  commitMessage: string;
  commitSha: string;
  pushedAt: string;
  type: string;
  payloadAction?: string;
}

export interface GitHubRepoDetails {
  stars: number;
}

interface GitHubRepo {
  name: string;
  pushed_at: string | null;
  stargazers_count?: number;
}

interface GitHubEvent {
  id: string;
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
      number?: number;
      title?: string;
      head?: {
        sha?: string;
      };
    };
    issue?: {
      number?: number;
      title?: string;
    };
    comment?: {
      body?: string;
      commit_id?: string;
    };
  };
}

interface GitHubIssueSearchItem {
  id: number;
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  updated_at: string;
  pull_request?: object;
}

interface GitHubIssueSearchResponse {
  items: GitHubIssueSearchItem[];
}

interface GitHubCommitResponse {
  commit?: {
    message?: string;
  };
}

const MAIN_USERNAME = "Wichtowski";
const PRIMARY_REPO_OWNER = MAIN_USERNAME.toLowerCase();
export const GITHUB_CONTRIBUTIONS_WINDOW_DAYS = 45;
const GITHUB_CONTRIBUTIONS_WINDOW_MS = GITHUB_CONTRIBUTIONS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
const repoDetailsCache = new Map<string, Promise<GitHubRepoDetails | null>>();

function getContributionsCutoff() {
  return Date.now() - GITHUB_CONTRIBUTIONS_WINDOW_MS;
}

export function isWithinGitHubContributionsWindow(date: string) {
  const timestamp = Date.parse(date);
  return !Number.isNaN(timestamp) && timestamp >= getContributionsCutoff();
}

export function isOutsideGitHubActivityScope(repoName: string) {
  const owner = repoName.split("/")[0]?.toLowerCase();
  return Boolean(owner) && owner !== PRIMARY_REPO_OWNER;
}

export function getGitHubActivityDisplayName(repoName: string) {
  const [owner, repo] = repoName.split("/");
  if (owner?.toLowerCase() === PRIMARY_REPO_OWNER && repo) {
    return repo;
  }

  return repoName;
}

async function githubFetch<T>(path: string, token?: string): Promise<T> {
  const authToken = token ?? env.GITHUB_TOKEN;
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "oskar-wichtowski-portfolio",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API failed: ${path} -> ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchRepoDetails(githubUrl: string): Promise<GitHubRepoDetails | null> {
  const match = githubUrl.match(/https?:\/\/github\.com\/([^/]+)\/([^/]+)/i);
  if (!match) return null;

  const [, owner, repo] = match;
  const cacheKey = `${owner}/${repo}`.toLowerCase();
  const cached = repoDetailsCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const request = fetchRepoDetailsFromGitHub(owner, repo);
  repoDetailsCache.set(cacheKey, request);
  return request;
}

async function fetchRepoDetailsFromGitHub(
  owner: string,
  repo: string,
): Promise<GitHubRepoDetails | null> {
  try {
    const data = await githubFetch<{ stargazers_count?: number }>(`/repos/${owner}/${repo}`);
    return { stars: data.stargazers_count ?? 0 };
  } catch (err) {
    console.warn(`Error compiling stats for ${owner}/${repo}:`, err);
    return null;
  }
}

async function fetchGitHubStats(
  username: string,
  token?: string,
): Promise<GitHubContributionsStats> {
  const profile = await githubFetch<{
    login: string;
    name?: string;
    avatar_url: string;
    public_repos?: number;
    followers?: number;
    following?: number;
  }>(`/users/${username}`, token);

  const repos = await githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&type=owner`,
    token,
  ).catch(() => []);
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

async function fetchPublicCommentActivities(username: string, maxPages: number, token?: string) {
  const activities: GitHubContributionsActivity[] = [];
  const createdAfter = new Date(getContributionsCutoff()).toISOString().slice(0, 10);

  for (let page = 1; page <= maxPages; page++) {
    const query = encodeURIComponent(
      `commenter:${username} -user:${username} updated:>=${createdAfter}`,
    );
    const response = await githubFetch<GitHubIssueSearchResponse>(
      `/search/issues?q=${query}&sort=updated&order=desc&per_page=100&page=${page}`,
      token,
    ).catch(() => null);

    if (!response) break;

    for (const item of response.items) {
      if (!isWithinGitHubContributionsWindow(item.updated_at)) continue;

      const repoName = item.repository_url.split("/repos/")[1];
      if (!repoName || !isOutsideGitHubActivityScope(repoName)) continue;

      const isPullRequest = Boolean(item.pull_request);
      activities.push({
        eventId: `comment-${item.id}`,
        repoName,
        repoUrl: `https://github.com/${repoName}`,
        commitMessage: `Commented on ${isPullRequest ? "pull request" : "issue"}: ${item.title}`,
        commitSha: `#${item.number}`,
        pushedAt: item.updated_at,
        type: isPullRequest ? "PullRequestReviewCommentEvent" : "IssueCommentEvent",
      });
    }

    if (response.items.length < 100) break;
  }

  return activities;
}

function getRecentActivitiesPerRepo(
  activities: GitHubContributionsActivity[],
  limit: number,
): GitHubContributionsActivity[] {
  const activitiesByRepo = new Map<string, GitHubContributionsActivity[]>();

  for (const activity of activities) {
    const repoName = activity.repoName.toLowerCase();
    const repoActivities = activitiesByRepo.get(repoName) ?? [];
    repoActivities.push(activity);
    activitiesByRepo.set(repoName, repoActivities);
  }

  return [...activitiesByRepo.values()].flatMap((repoActivities) =>
    repoActivities.sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt)).slice(0, limit),
  );
}

async function hydratePushCommitMessages(
  activities: GitHubContributionsActivity[],
  token?: string,
): Promise<GitHubContributionsActivity[]> {
  const unresolvedPushes = new Map<string, GitHubContributionsActivity>();

  for (const activity of activities) {
    if (activity.type !== "PushEvent" || activity.commitMessage !== "Active development") {
      continue;
    }
    if (!activity.commitSha) continue;

    unresolvedPushes.set(
      `${activity.repoName.toLowerCase()}:${activity.commitSha.toLowerCase()}`,
      activity,
    );
  }

  const resolvedMessages = new Map<string, string>();
  await Promise.all(
    [...unresolvedPushes.entries()].map(async ([key, activity]) => {
      const [owner, repo] = activity.repoName.split("/");
      if (!owner || !repo) return;

      const commit = await githubFetch<GitHubCommitResponse>(
        `/repos/${owner}/${repo}/commits/${encodeURIComponent(activity.commitSha)}`,
        token,
      ).catch(() => null);
      const message = commit?.commit?.message?.split("\n")[0];
      if (message) resolvedMessages.set(key, message);
    }),
  );

  return activities.map((activity) => {
    const key = `${activity.repoName.toLowerCase()}:${activity.commitSha.toLowerCase()}`;
    const commitMessage = resolvedMessages.get(key);
    return commitMessage ? { ...activity, commitMessage } : activity;
  });
}

async function fetchRecentRepoActivities(
  username: string,
  maxPages = 3,
  token?: string,
): Promise<GitHubContributionsActivities> {
  const publicEventTypes = new Set([
    "PushEvent",
    "PullRequestEvent",
    "IssuesEvent",
    "IssueCommentEvent",
    "PullRequestReviewCommentEvent",
    "CommitCommentEvent",
    "CreateEvent",
  ]);

  const privateEvents: GitHubEvent[] = [];
  const publicEvents: GitHubEvent[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const events = await githubFetch<GitHubEvent[]>(
      `/users/${username}/events/public?per_page=100&page=${page}`,
      token,
    ).catch(() => null);

    if (!events) break;

    for (const event of events) {
      if (!isWithinGitHubContributionsWindow(event.created_at)) continue;

      const isPublicContribution = isOutsideGitHubActivityScope(event.repo.name);
      const target = isPublicContribution ? publicEvents : privateEvents;
      const isSupported = isPublicContribution
        ? publicEventTypes.has(event.type)
        : event.type === "PushEvent";

      if (!isSupported) continue;

      target.push(event);
    }

    if (events.length < 100) break;
  }

  const privateActivity = privateEvents.map(formatGitHubEvent);
  const publicActivity = publicEvents.map(formatGitHubEvent);
  const searchedCommentActivity = await fetchPublicCommentActivities(username, 3, token).catch(
    () => [],
  );
  const existingPublicActions = new Set(
    publicActivity.map(
      (activity) =>
        `${activity.repoName.toLowerCase()}:${activity.commitSha}:${activity.type.toLowerCase()}`,
    ),
  );

  const recentPrivateActivity = getRecentActivitiesPerRepo(privateActivity, 6);
  const recentPublicActivity = getRecentActivitiesPerRepo(
    [
      ...publicActivity,
      ...searchedCommentActivity.filter(
        (activity) =>
          !existingPublicActions.has(
            `${activity.repoName.toLowerCase()}:${activity.commitSha}:${activity.type.toLowerCase()}`,
          ),
      ),
    ],
    6,
  );

  const [hydratedPrivateActivity, hydratedPublicActivity] = await Promise.all([
    hydratePushCommitMessages(recentPrivateActivity, token),
    hydratePushCommitMessages(recentPublicActivity, token),
  ]);

  return {
    private: hydratedPrivateActivity,
    public: hydratedPublicActivity,
  };
}

export const GITHUB_CONTRIBUTIONS_CACHE_KEY = "github-contributions-cache-v3";
export const GITHUB_CONTRIBUTIONS_LEGACY_CACHE_KEYS = ["github-cache"];
export const GITHUB_CONTRIBUTIONS_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

export type GitHubContributionsActivities = {
  private: GitHubContributionsActivity[];
  public: GitHubContributionsActivity[];
};

type GitHubContributionsResult = {
  generatedAt: string;
  mainStats: GitHubContributionsStats | null;
  activities: GitHubContributionsActivities;
  workStats: GitHubContributionsStats | null;
  partial: boolean;
};

let _serverCache: { data: GitHubContributionsResult; cachedAt: number } | null = null;

export async function buildGitHubContributions(options?: {
  githubToken?: string;
}): Promise<GitHubContributionsResult> {
  if (_serverCache && Date.now() - _serverCache.cachedAt < GITHUB_CONTRIBUTIONS_CACHE_TTL_MS) {
    return _serverCache.data;
  }

  const token = options?.githubToken ?? env.GITHUB_TOKEN;

  const activities = await fetchRecentRepoActivities(MAIN_USERNAME, 3, token).catch(() => ({
    private: [],
    public: [],
  }));
  const mainStats = await fetchGitHubStats(MAIN_USERNAME, token).catch(() => null);
  const workStats = null;
  const partial =
    mainStats === null || (activities.private.length === 0 && activities.public.length > 0);

  const result: GitHubContributionsResult = {
    generatedAt: new Date().toISOString(),
    mainStats,
    activities,
    workStats,
    partial,
  };

  if (!partial) {
    _serverCache = { data: result, cachedAt: Date.now() };
  }

  return result;
}

function formatGitHubEvent(event: GitHubEvent): GitHubContributionsActivity {
  const repoName = event.repo.name;
  let commitMessage = "Active development";
  let commitSha = "";

  if (event.type === "PushEvent") {
    const latestCommit = event.payload?.commits?.at(-1);
    commitMessage = latestCommit?.message?.split("\n")[0] || commitMessage;
    commitSha = event.payload?.head ?? latestCommit?.sha ?? "";
  }

  if (event.type === "PullRequestEvent") {
    commitMessage = `${event.payload?.action ?? "Updated"} pull request: ${
      event.payload?.pull_request?.title ?? ""
    }`;
    commitSha = `#${event.payload?.number ?? ""}`;
  }

  if (event.type === "IssuesEvent") {
    commitMessage = `${event.payload?.action ?? "Updated"} issue: ${
      event.payload?.issue?.title ?? ""
    }`;
    commitSha = `#${event.payload?.number ?? ""}`;
  }

  if (event.type === "IssueCommentEvent") {
    commitMessage = `Commented on issue: ${event.payload?.issue?.title ?? ""}`;
    commitSha = `#${event.payload?.issue?.number ?? event.payload?.number ?? ""}`;
  }

  if (event.type === "PullRequestReviewCommentEvent") {
    commitMessage = `Commented on pull request: ${event.payload?.pull_request?.title ?? ""}`;
    commitSha = `#${event.payload?.pull_request?.number ?? event.payload?.number ?? ""}`;
  }

  if (event.type === "CommitCommentEvent") {
    commitMessage = "Commented on a commit";
    commitSha = event.payload?.comment?.commit_id ?? "";
  }

  if (event.type === "CreateEvent") {
    commitMessage = `Created ${event.payload?.ref_type ?? "repository"}: ${
      event.payload?.ref ?? repoName
    }`;
  }

  return {
    eventId: event.id,
    repoName,
    repoUrl: `https://github.com/${repoName}`,
    commitMessage,
    commitSha,
    pushedAt: event.created_at,
    type: event.type,
    payloadAction: event.payload?.action,
  };
}
