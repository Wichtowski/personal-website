export interface GitHubStats {
  username: string;
  name: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  stars: number;
}

export interface GitHubActivity {
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
  [key: string]: unknown;
}

/**
 * Fetches user profile and calculates stars from public repositories.
 */
export async function fetchGitHubStats(username: string): Promise<GitHubStats | null> {
  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);
    if (!profileRes.ok) {
      console.warn(`GitHub API error (Status: ${profileRes.status}) for ${username}. Falling back to mock data.`);
      return null;
    }
    const profile = await profileRes.json() as { name?: string; login: string; avatar_url: string; public_repos?: number; followers?: number; following?: number };

    // Fetch repos to calculate stars (GitHub API defaults to 30 per page, let's fetch up to 100)
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    let stars = 0;
    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        stars = (repos as GitHubRepo[]).reduce((acc: number, repo: GitHubRepo) => acc + (repo.stargazers_count || 0), 0);
      }
    }

    return {
      username,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
      publicRepos: profile.public_repos || 0,
      followers: profile.followers || 0,
      following: profile.following || 0,
      stars,
    };
  } catch (err) {
    console.warn(`Failed to fetch GitHub stats for ${username}.`, err);
    return null;
  }
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
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
      title: string;
    };
    issue?: {
      title: string;
    };
  };
}

/**
 * Fetches the latest public activity (push, commit, issue, PR) for a user.
 */
export async function fetchLatestActivity(username: string): Promise<GitHubActivity | null> {
  try {
    const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`);
    if (!eventsRes.ok) {
      console.warn(`GitHub API activity error (Status: ${eventsRes.status}) for ${username}. Falling back to mock activity.`);
    }
    const events = await eventsRes.json() as GitHubEvent[];
    if (!Array.isArray(events) || events.length === 0) {
      return null;
    }

    // Find the first relevant push event or pull request event
    const pushOrPrEvent = events.find(
      (event) => event.type === "PushEvent" || event.type === "PullRequestEvent" || event.type === "CreateEvent"
    );

    const activeEvent = pushOrPrEvent || events[0];

    const repoName = activeEvent.repo.name;
    let commitMessage = "Active development";
    let commitSha = "";
    const pushedAt = activeEvent.created_at;
    const type = activeEvent.type;

    if (activeEvent.type === "PushEvent" && activeEvent.payload?.commits && activeEvent.payload.commits.length > 0) {
      commitMessage = activeEvent.payload.commits[0].message;
      commitSha = activeEvent.payload.commits[0].sha.substring(0, 7);
    } else if (activeEvent.type === "PullRequestEvent") {
      commitMessage = `${activeEvent.payload?.action || "Opened"} pull request: ${activeEvent.payload?.pull_request?.title || ""}`;
      commitSha = `#${activeEvent.payload?.number || ""}`;
    } else if (activeEvent.type === "IssuesEvent") {
      commitMessage = `${activeEvent.payload?.action || "Opened"} issue: ${activeEvent.payload?.issue?.title || ""}`;
    } else if (activeEvent.type === "CreateEvent") {
      commitMessage = `Created a new ${activeEvent.payload?.ref_type || "repository"}: ${activeEvent.payload?.ref || repoName}`;
    }

    return {
      repoName,
      repoUrl: `https://github.com/${repoName}`,
      commitMessage,
      commitSha,
      pushedAt,
      type,
      payloadAction: activeEvent.payload?.action,
    };
  } catch (err) {
    console.warn(`Failed to fetch GitHub activity for ${username}.`, err);
    return null;
  }
}
