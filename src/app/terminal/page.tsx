import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { TerminalExperience } from "@components/terminal/TerminalExperience";
import { getArticles, getProjects } from "@lib/mdx";

const terminalFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-terminal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Terminal",
  description:
    "Explore Oskar Wichtowski's projects, articles, contributions and experience through an interactive command-line portfolio.",
  alternates: { canonical: "/terminal" },
};

export default function TerminalPage() {
  return (
    <div className={terminalFont.variable}>
      <TerminalExperience articles={getArticles()} projects={getProjects()} />
    </div>
  );
}
