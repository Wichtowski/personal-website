import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

const contentDirectory = path.join(process.cwd(), "src/content");

function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Gets all MDX projects from src/content/projects
 */
export function getProjects(locale: "en" | "pl" = "en"): ProjectMetadata[] {
  const projectsDir = path.join(contentDirectory, "projects");
  ensureDirectoryExistence(projectsDir);

  const files = fs.readdirSync(projectsDir);
  const projects: ProjectMetadata[] = [];

  for (const filename of files) {
    if (!filename.endsWith(".mdx") && !filename.endsWith(".md")) continue;

    const filePath = path.join(projectsDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    const slug = filename.replace(/\.mdx?$/, "");
    const projectLang = data.language || "en";

    // Filter projects matching the active language
    if (projectLang === locale) {
      projects.push({
        title: data.title || "Untitled Project",
        description: data.description || "",
        date: data.date || "",
        category: data.category || "dev",
        tags: data.tags || [],
        thumbnail: data.thumbnail || "",
        githubUrl: data.githubUrl || "",
        liveUrl: data.liveUrl || "",
        slug,
        language: projectLang,
      });
    }
  }

  // Sort projects by date descending
  return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Gets a single project's content and metadata by its slug
 */
export function getProjectBySlug(slug: string) {
  const projectsDir = path.join(contentDirectory, "projects");
  ensureDirectoryExistence(projectsDir);

  // Try reading slug.mdx first, then slug.md
  let filePath = path.join(projectsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(projectsDir, `${slug}.md`);
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    metadata: {
      title: data.title || "Untitled Project",
      description: data.description || "",
      date: data.date || "",
      category: data.category || "dev",
      tags: data.tags || [],
      thumbnail: data.thumbnail || "",
      githubUrl: data.githubUrl || "",
      liveUrl: data.liveUrl || "",
      slug,
      language: data.language || "en",
    } as ProjectMetadata,
    content,
  };
}

/**
 * Gets all MDX articles from src/content/blog
 */
export function getArticles(locale: "en" | "pl" = "en"): ArticleMetadata[] {
  const blogDir = path.join(contentDirectory, "blog");
  ensureDirectoryExistence(blogDir);

  const files = fs.readdirSync(blogDir);
  const articles: ArticleMetadata[] = [];

  for (const filename of files) {
    if (!filename.endsWith(".mdx") && !filename.endsWith(".md")) continue;

    const filePath = path.join(blogDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    const slug = filename.replace(/\.mdx?$/, "");
    const articleLang = data.language || "en";

    if (articleLang === locale) {
      articles.push({
        title: data.title || "Untitled Article",
        description: data.description || "",
        date: data.date || "",
        readTime: data.readTime || "3 min",
        tags: data.tags || [],
        slug,
        language: articleLang,
      });
    }
  }

  // Sort articles by date descending
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Gets a single article's content and metadata by its slug
 */
export function getArticleBySlug(slug: string) {
  const blogDir = path.join(contentDirectory, "blog");
  ensureDirectoryExistence(blogDir);

  let filePath = path.join(blogDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(blogDir, `${slug}.md`);
  }

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    metadata: {
      title: data.title || "Untitled Article",
      description: data.description || "",
      date: data.date || "",
      readTime: data.readTime || "3 min",
      tags: data.tags || [],
      slug,
      language: data.language || "en",
    } as ArticleMetadata,
    content,
  };
}
