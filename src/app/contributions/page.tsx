import GithubContent from "@components/github/GithubContet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributions",
  description: "Recent public development activity and profiles from Oskar Wichtowski.",
  alternates: { canonical: "/contributions" },
};

export default function ContributionsPage() {
  return <GithubContent />;
}
