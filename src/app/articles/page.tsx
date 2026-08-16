import { BlogSection } from "@components/blog/BlogSection";
import { getArticles } from "@lib/mdx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Articles by Oskar Wichtowski about AI engineering, LLM integrations, full-stack development, and software quality.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  return <BlogSection articles={getArticles()} />;
}
