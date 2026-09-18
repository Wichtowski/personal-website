import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { ArticleMetadata } from "./mdx";
import { buildRssFeed, createRssResponse } from "./rss";

const article: ArticleMetadata = {
  title: "AI & <testing>",
  description: 'A "reliable" test',
  date: "2026-01-01",
  readTime: "5 min",
  tags: ["AI & testing"],
  slug: "ai-testing",
  language: "en",
};

describe("RSS feed", () => {
  test("serializes article metadata as valid escaped XML", () => {
    const rss = buildRssFeed([article], new Date("2026-01-02T00:00:00Z"));

    assert.match(rss, /<title>AI &amp; &lt;testing&gt;<\/title>/);
    assert.match(rss, /<description>A &quot;reliable&quot; test<\/description>/);
    assert.match(rss, /<category>AI &amp; testing<\/category>/);
    assert.match(rss, /<lastBuildDate>Fri, 02 Jan 2026 00:00:00 GMT<\/lastBuildDate>/);
    assert.match(rss, /<atom:link href="https:\/\/oskarwichtowski.com\/rss.xml"/);
  });

  test("returns the RSS content type and sitemap-equivalent cache policy", () => {
    const response = createRssResponse([article]);

    assert.equal(response.headers.get("Content-Type"), "application/rss+xml; charset=utf-8");
    assert.equal(response.headers.get("Cache-Control"), "public, max-age=0, must-revalidate");
  });
});
