export const runtime = "edge";

const MAIN_USERNAME = "Wichtowski";
const WORK_USERNAME = "oskar-wichtowski-wttech";

const CACHE_SECONDS = 60 * 30; // 30 min
const STALE_SECONDS = 60 * 60 * 24; // 24h

interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
}

interface GitHubActivity {
  repoName: string;
  repoUrl: string;
  commitMessage: string;
  commitSha: string;
  pushedAt: string;
  type: string;
  payloadAction?: string;
}

interface GitHubRepo {
  stargazers_count?: number;
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
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    pull_request?: {
      title?: string;
    };
    issue?: {
      title?: string;
    };
  };
}

type CloudflareCacheStorage = CacheStorage & {
  default: Cache;
};

function getDefaultCache(): Cache | null {
  if (typeof caches === "undefined") return null;
  return (caches as CloudflareCacheStorage).default;
}

function jsonResponse(data: unknown, cacheStatus: "HIT" | "MISS" | "BYPASS", status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": `public, max-age=60, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "CDN-Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Cache": cacheStatus,
    },
  });
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "oskar-wichtowski-portfolio",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API failed: ${path} -> ${res.status}`);
  }

  return res.json() as Promise<T>;
}

async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  const profile = await githubFetch<{
    login: string;
    name?: string;
    avatar_url: string;
    public_repos?: number;
    followers?: number;
    following?: number;
  }>(`/users/${username}`);

  const repos = await githubFetch<GitHubRepo[]>(
    `/users/${username}/repos?per_page=100&type=owner`
  );

  const stars = repos.reduce(
    (acc, repo) => acc + (repo.stargazers_count ?? 0),
    0
  );

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

async function fetchRecentRepoActivities(
  username: string,
  limit = 3
): Promise<GitHubActivity[]> {
  const events = await githubFetch<GitHubEvent[]>(
    `/users/${username}/events/public?per_page=30`
  );

  const supportedTypes = new Set([
    "PushEvent",
    "PullRequestEvent",
    "IssuesEvent",
    "CreateEvent",
  ]);

  const seenRepos = new Set<string>();
  const activities: GitHubActivity[] = [];

  for (const event of events) {
    if (!supportedTypes.has(event.type)) continue;
    if (seenRepos.has(event.repo.name)) continue;

    seenRepos.add(event.repo.name);
    activities.push(formatGitHubEvent(event));

    if (activities.length >= limit) break;
  }

  return activities;
}

async function buildPulse() {
  const [mainStats, latestActivity, workStats] = await Promise.all([
    fetchGitHubStats(MAIN_USERNAME),
    fetchRecentRepoActivities(MAIN_USERNAME, 3),
    fetchGitHubStats(WORK_USERNAME).catch(() => null),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    mainStats,
    latestActivity,
    workStats,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cacheKey = new Request(`${url.origin}/api/github/pulse?v=2`, {
    method: "GET",
  });

  const cache = getDefaultCache();

  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, {
        status: cached.status,
        headers: {
          ...Object.fromEntries(cached.headers),
          "X-Cache": "HIT",
        },
      });
    }
  }

  try {
    const data = await buildPulse();
    const response = jsonResponse(data, "MISS");

    if (cache) {
      await cache.put(cacheKey, response.clone());
    }

    return response;
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: "Could not load GitHub pulse",
        generatedAt: new Date().toISOString(),
      },
      "BYPASS",
      502
    );
  }
}


function formatGitHubEvent(event: GitHubEvent): GitHubActivity {
  const repoName = event.repo.name;
  let commitMessage = "Active development";
  let commitSha = "";

  if (event.type === "PushEvent" && event.payload?.commits?.length) {
    commitMessage = event.payload.commits[0].message;
    commitSha = event.payload.commits[0].sha.slice(0, 7);
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
  }

  if (event.type === "CreateEvent") {
    commitMessage = `Created ${event.payload?.ref_type ?? "repository"}: ${
      event.payload?.ref ?? repoName
    }`;
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