"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, BookOpen, Calendar, Folder, Search, X } from "lucide-react";
import { useLanguage } from "@context/LanguageContext";
import type { ArticleMetadata, ProjectMetadata } from "@lib/mdx";
import { matchesContentTag, normalizeContentTag } from "@lib/article-tags";
import { formatDate } from "@lib/date";

interface ExploreSectionProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  activeTags: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function getMatchingTags(itemTags: string[], activeTags: string[]) {
  return itemTags.filter((itemTag) =>
    activeTags.some((activeTag) => matchesContentTag(itemTag, activeTag)),
  );
}

export function ExploreSection({ projects, articles, activeTags }: ExploreSectionProps) {
  const { language, t } = useLanguage();
  const normalizedActiveTags = useMemo(() => {
    const seen = new Set<string>();

    return activeTags.filter((tag) => {
      const normalizedTag = normalizeContentTag(tag);

      if (!normalizedTag || seen.has(normalizedTag)) {
        return false;
      }

      seen.add(normalizedTag);
      return true;
    });
  }, [activeTags]);

  const hasActiveTags = normalizedActiveTags.length > 0;
  const matchingProjects = projects.filter((project) => {
    return (
      project.language === language &&
      hasActiveTags &&
      project.tags.some((tag) =>
        normalizedActiveTags.some((activeTag) => matchesContentTag(tag, activeTag)),
      )
    );
  });
  const matchingArticles = articles.filter((article) => {
    return (
      article.language === language &&
      hasActiveTags &&
      article.tags.some((tag) =>
        normalizedActiveTags.some((activeTag) => matchesContentTag(tag, activeTag)),
      )
    );
  });
  const exploreTagsValue = normalizedActiveTags.join(",");

  return (
    <section className="min-h-screen bg-background pt-24 pb-16 md:pt-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Explore
            </p>
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
              <Search size={48} className="shrink-0 text-primary" />
              Technology evidence
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              Projects and articles connected by the technologies selected from the stack.
            </p>
          </div>

          {hasActiveTags ? (
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <X size={14} />
              Clear
            </Link>
          ) : null}
        </div>

        {hasActiveTags ? (
          <div className="flex flex-wrap gap-2">
            {normalizedActiveTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 p-8 text-sm text-muted-foreground">
            Select technologies from the home stack first.
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {matchingProjects.length > 0 ? (
            <section className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 font-mono text-xl font-bold text-foreground">
                  <Folder size={24} className="text-primary" />
                  {t.nav.portfolio}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {matchingProjects.length} matching project
                  {matchingProjects.length === 1 ? "" : "s"}
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-4"
              >
                {matchingProjects.map((project) => {
                  const matchedTags = getMatchingTags(project.tags, normalizedActiveTags);

                  return (
                    <motion.div key={project.slug} variants={itemVariants}>
                      <Link
                        href={{
                          pathname: `/portfolio/${project.slug}`,
                          query: { from: "explore", tags: exploreTagsValue },
                        }}
                        className="group flex min-h-56 flex-col justify-between rounded-2xl border border-border/40 bg-muted/10 p-5 transition-all duration-300 hover:border-primary/25 hover:bg-muted/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={project.title}
                      >
                        <div>
                          <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-primary/15 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                              {project.category}
                            </span>
                            {matchedTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <h3 className="mb-2 font-mono text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {project.title}
                          </h3>
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-border/30 pt-4 font-mono text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                          <span>{t.portfolio.viewProject}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          ) : null}

          {matchingArticles.length > 0 ? (
            <section className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 font-mono text-xl font-bold text-foreground">
                  <BookOpen size={24} className="text-primary" />
                  {t.nav.articles}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {matchingArticles.length} matching article
                  {matchingArticles.length === 1 ? "" : "s"}
                </p>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {matchingArticles.map((article) => {
                  const matchedTags = getMatchingTags(article.tags, normalizedActiveTags);

                  return (
                    <motion.div key={article.slug} variants={itemVariants}>
                      <Link
                        href={{
                          pathname: `/blog/${article.slug}`,
                          query: { from: "explore", tags: exploreTagsValue },
                        }}
                        className="group flex flex-col gap-5 rounded-2xl border border-border/40 bg-muted/5 p-5 transition-all duration-300 hover:border-primary/25 hover:bg-muted/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        aria-label={article.title}
                      >
                        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(article.date, language, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {matchedTags.map((tag) => (
                            <span key={tag} className="font-bold text-primary">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div>
                          <h3 className="mb-2 font-mono text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {article.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/30 pt-4 font-mono text-xs font-bold text-foreground transition-colors group-hover:text-primary">
                          <span>{article.readTime}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
