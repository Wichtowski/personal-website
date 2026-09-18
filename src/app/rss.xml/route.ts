import { getArticles } from "@lib/mdx";
import { createRssResponse } from "@lib/rss";

export const dynamic = "force-static";

export function GET() {
  const articles = getArticles()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  return createRssResponse(articles);
}
