"use client";

import { useLanguage } from "@context/LanguageContext";
import { ArticleMetadata } from "@lib/mdx";
import { motion } from "framer-motion";
import {
  BlogArticleStack,
  BlogSectionHeader,
  containerVariants,
  itemVariants,
  slideDirectionVariants,
} from "./";
import { Footer } from "@components/layout/Footer";
interface BlogSectionProps {
  articles: ArticleMetadata[];
}

export function BlogSection({ articles }: BlogSectionProps) {
  const { language, t } = useLanguage();

  const filteredArticles = articles.filter((article) => {
    return article.language === language;
  });

  return (
    <section
      id="articles"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col bg-background/50 border-r border-border/40 relative pt-6 pb-4 md:pt-32"
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

        {filteredArticles.length > 0 ? (
          <BlogArticleStack
            articles={filteredArticles}
            language={language}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        ) : (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground font-mono">{t.blog.noArticles}</p>
          </div>
        )}
      </motion.div>
      <Footer />
    </section>
  );
}
