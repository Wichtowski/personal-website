import { buildGitHubPulse } from "@/lib/github-pulse";
import GithubPageClient from "./page-client";

export default async function GithubPage() {
  const initialData = await buildGitHubPulse();

  return <GithubPageClient initialData={initialData} />;
}
