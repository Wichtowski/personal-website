import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

test("hidden projects are excluded from listings, routes, and language alternates", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false },
    plugins: [
      { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    ],
  });

  try {
    const content = (await server.ssrLoadModule("/src/lib/mdx.ts")) as typeof import("./mdx");

    for (const slug of ["streamsphere", "streamsphere-pl"]) {
      assert.equal(content.getProjectSlugs().includes(slug), false);
      assert.equal(
        content.getProjects().some((project) => project.slug === slug),
        false,
      );
      assert.equal(content.getProjectBySlug(slug), null);
      assert.deepEqual(content.getProjectLanguageAlternates(slug), {});
    }

    assert.ok(content.getProjectBySlug("aaidle"));
    assert.ok(content.getProjects("en").some((project) => project.slug === "aaidle"));
    assert.ok(content.getProjects("pl").some((project) => project.slug === "aaidle-pl"));
    assert.deepEqual(content.getProjectLanguageAlternates("aaidle"), {
      en: "aaidle",
      pl: "aaidle-pl",
    });
  } finally {
    await server.close();
  }
});
