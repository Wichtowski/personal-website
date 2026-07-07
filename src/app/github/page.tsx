import GithubContent from "@components/github/GithubContet";
import { buildGitHubPulse } from "@lib/github-pulse";

export default async function GithubPage() {
  let initialData = null;
  try {
    initialData = await buildGitHubPulse();
  } catch (error) {
    console.error("Failed to build GitHub pulse on server:", error);
  }

  return <GithubContent initialData={initialData} />;
}
