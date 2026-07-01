import { buildGitHubPulse } from "@lib/github-pulse";
import GithubPageClient from "./page-client";

export default async function GithubPage() {
  let initialData = null;
  try {
    initialData = await buildGitHubPulse();
  } catch (error) {
    console.error("Failed to build GitHub pulse on server:", error);
  }

  return <GithubPageClient initialData={initialData} />;
}
