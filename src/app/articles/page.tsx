import { BlogSection } from "@components/blog/BlogSection";
import { getArticles } from "@lib/mdx";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const articles = getArticles();
  const { tag } = await searchParams;

  return <BlogSection articles={articles} activeTag={tag} />;
}
