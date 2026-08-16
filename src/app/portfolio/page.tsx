import { PortfolioSection } from "@components/portfolio/PortfolioSection";
import { getProjects } from "@lib/mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "AI engineering, full-stack development, and automation projects by Oskar Wichtowski.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  const projects = getProjects();
  return <PortfolioSection projects={projects} />;
}
