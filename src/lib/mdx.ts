import type { ComponentType } from "react";

export interface ProjectMetadata {
  title: string;
  description: string;
  date: string;
  category: "ai" | "dev" | "qa";
  tags: string[];
  thumbnail?: string;
  githubUrl?: string;
  liveUrl?: string;
  slug: string;
  language: "en" | "pl";
}

export interface ArticleMetadata {
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  language: "en" | "pl";
}

interface MdxModule {
  default: ComponentType;
  frontmatter: Record<string, unknown>;
}

// @mdx-js/rollup compiles MDX files to React components at build time.
// remark-mdx-frontmatter exports YAML frontmatter as a named `frontmatter` export.
// Works in Cloudflare Workers — no fs, no HTTP, all bundled at build time.
const blogModules = import.meta.glob<MdxModule>("../content/blog/*.mdx", { eager: true });
const projectModules = import.meta.glob<MdxModule>("../content/projects/*.mdx", { eager: true });

const pathToSlug = (filePath: string): string => {
  return (
    filePath
      .split("/")
      .pop()
      ?.replace(/\.mdx?$/, "") ?? ""
  );
};

const toArticleMetadata = (fm: Record<string, unknown>, slug: string): ArticleMetadata => {
  return {
    title: typeof fm.title === "string" ? fm.title : "Untitled Article",
    description: typeof fm.description === "string" ? fm.description : "",
    date: typeof fm.date === "string" ? fm.date : "",
    readTime: typeof fm.readTime === "string" ? fm.readTime : "3 min",
    tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
    slug,
    language: fm.language === "pl" ? "pl" : "en",
  };
};

const toProjectMetadata = (fm: Record<string, unknown>, slug: string): ProjectMetadata => {
  const validCategories = ["ai", "dev", "qa"] as const;
  const category = validCategories.find((c) => c === fm.category) ?? "dev";
  return {
    title: typeof fm.title === "string" ? fm.title : "Untitled Project",
    description: typeof fm.description === "string" ? fm.description : "",
    date: typeof fm.date === "string" ? fm.date : "",
    category,
    tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : [],
    thumbnail: typeof fm.thumbnail === "string" ? fm.thumbnail : undefined,
    githubUrl: typeof fm.githubUrl === "string" ? fm.githubUrl : undefined,
    liveUrl: typeof fm.liveUrl === "string" ? fm.liveUrl : undefined,
    slug,
    language: fm.language === "pl" ? "pl" : "en",
  };
};

export function getArticleSlugs(): string[] {
  return Object.keys(blogModules).map(pathToSlug);
}

export function getProjectSlugs(): string[] {
  return Object.keys(projectModules).map(pathToSlug);
}

export function getArticleBySlug(slug: string) {
  const key = Object.keys(blogModules).find((k) => pathToSlug(k) === slug);
  if (!key) return null;
  const mod = blogModules[key];
  return { metadata: toArticleMetadata(mod.frontmatter, slug), Component: mod.default };
}

export function getProjectBySlug(slug: string) {
  const key = Object.keys(projectModules).find((k) => pathToSlug(k) === slug);
  if (!key) return null;
  const mod = projectModules[key];
  return { metadata: toProjectMetadata(mod.frontmatter, slug), Component: mod.default };
}

export function getArticles(locale?: "en" | "pl"): ArticleMetadata[] {
  const now = Date.now();
  const articles = Object.entries(blogModules)
    .map(([path, mod]) => toArticleMetadata(mod.frontmatter, pathToSlug(path)))
    .filter((a) => new Date(a.date).getTime() <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return locale ? articles.filter((a) => a.language === locale) : articles;
}

export function getProjects(locale?: "en" | "pl"): ProjectMetadata[] {
  const now = Date.now();
  const projects = Object.entries(projectModules)
    .map(([path, mod]) => toProjectMetadata(mod.frontmatter, pathToSlug(path)))
    .filter((p) => new Date(p.date).getTime() <= now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return locale ? projects.filter((p) => p.language === locale) : projects;
}
