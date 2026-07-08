// src/app/rss.xml/route.ts
import { getArticles } from "@lib/mdx";

const siteUrl = "https://oskarwichtowski.com";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const revalidate = 3600;

export async function GET() {
  const articles = getArticles()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  const items = articles
    .map((article) => {
      const url = `${siteUrl}/blog/${article.slug}`;

      return `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <description>${escapeXml(article.description)}</description>
          <pubDate>${new Date(article.date).toUTCString()}</pubDate>
          ${article.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("") ?? ""}
        </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Oskar Wichtowski</title>
    <link>${siteUrl}</link>
    <description>Articles about AI engineering, LLM integrations, full-stack development, automation, and software projects.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
