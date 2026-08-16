import GithubContent from "@components/github/GithubContet";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Activity",
  description: "Recent public GitHub activity from Oskar Wichtowski.",
  alternates: { canonical: "/github" },
};

export default function GithubPage() {
  return <GithubContent />;
}
