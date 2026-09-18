import type { ArticleMetadata } from "./mdx";
import { SITE_URL } from "./site";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildRssFeed(articles: ArticleMetadata[], buildDate = new Date()): string {
  const items = articles
    .map((article) => {
      const url = `${SITE_URL}/blog/${article.slug}`;
      const categories = article.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(article.description)}</description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      ${categories}
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oskar Wichtowski - Articles</title>
    <link>${SITE_URL}/articles</link>
    <description>Articles about AI engineering, LLM integrations, full-stack development, automation, and software projects.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;
}

export function createRssResponse(articles: ArticleMetadata[]): Response {
  return new Response(buildRssFeed(articles), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
