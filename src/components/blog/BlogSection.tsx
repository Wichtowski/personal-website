"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArticleMetadata } from "@/lib/mdx";
import { matchesArticleTag, normalizeArticleTag } from "@/lib/article-tags";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BlogArticleStack,
  BlogSectionHeader,
  containerVariants,
  itemVariants,
  slideDirectionVariants,
} from "./";
interface BlogSectionProps {
  articles: ArticleMetadata[];
  activeTag?: string;
}

export function BlogSection({ articles, activeTag }: BlogSectionProps) {
  const { language, t } = useLanguage();
  const normalizedActiveTag = activeTag ? normalizeArticleTag(activeTag) : null;

  // Filter articles by active client language
  const filteredArticles = articles.filter((article) => {
    if (article.language !== language) {
      return false;
    }

    if (!normalizedActiveTag) {
      return true;
    }

    return article.tags.some((tag) => matchesArticleTag(tag, normalizedActiveTag));
  });

  return (
    <section
      id="articles"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col bg-background/50 border-r border-border/40 relative pt-6 pb-20 md:py-32"
    >
      <div className="absolute inset-0 bg-radial-gradient from-primary/3 via-transparent to-transparent -z-10" />

      <motion.div
        variants={slideDirectionVariants()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        <BlogSectionHeader title={t.blog.title} subtitle={t.blog.subtitle} />

        {activeTag ? (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono text-muted-foreground">
              Filter: <span className="text-foreground">#{activeTag}</span>
            </span>
            <Link
              href="/articles"
              className="rounded-full border border-border/40 bg-background/80 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
            >
              Clear filter
            </Link>
          </div>
        ) : null}

        {/* Article Stack */}
        {filteredArticles.length > 0 ? (
          <BlogArticleStack
            articles={filteredArticles}
            language={language}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        ) : (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground font-mono">
              {activeTag ? `No articles found for #${activeTag}.` : t.blog.noArticles}
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
