import { BlogSection } from "@components/blog/BlogSection";
import { getArticles } from "@lib/mdx";

export default function ArticlesPage() {
  return <BlogSection articles={getArticles()} />;
}
