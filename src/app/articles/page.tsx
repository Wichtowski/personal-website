import { BlogSection } from "@/components/blog/BlogSection";
import { getArticles } from "@/lib/mdx";

export default function ArticlesPage() {
  const articles = getArticles();
  return <BlogSection articles={articles} />;
}
