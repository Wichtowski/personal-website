import type { MetadataRoute } from "next";
import { getArticles, getProjects } from "@lib/mdx";
import { SITE_URL } from "@lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/github", "/portfolio", "/articles", "/contact", "/explore"].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
    }),
  );

  const articleRoutes = getArticles().map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
  }));

  const projectRoutes = getProjects().map((project) => ({
    url: `${SITE_URL}/portfolio/${project.slug}`,
    lastModified: new Date(project.date),
  }));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
}
