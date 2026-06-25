import { BlogSection } from "@/components/blog/BlogSection";
import { getArticles } from "@/lib/mdx";

export default function ArticlesPage() {
  const articles = getArticles("en").concat(getArticles("pl"));
  return <BlogSection articles={articles} />;
}
