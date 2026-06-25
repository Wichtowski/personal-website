"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArticleMetadata } from "@/lib/mdx";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { getNavDirection } from "@/lib/navigation";
import Link from "next/link";

interface BlogSectionProps {
  articles: ArticleMetadata[];
}

export function BlogSection({ articles }: BlogSectionProps) {
  const { language, t } = useLanguage();

  // Filter articles by active client language
  const filteredArticles = articles.filter((article) => article.language === language);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 85 } },
  };

  const slideDirectionVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      get x() {
        return typeof window !== "undefined" ? getNavDirection() * 50 : 50;
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 60 }
    }
  };

  return (
    <section id="articles" className="w-screen h-screen overflow-y-auto flex flex-col bg-background/50 border-r border-border/40 relative py-32">
      <div className="absolute inset-0 bg-radial-gradient from-primary/3 via-transparent to-transparent -z-10" />

      <motion.div
        variants={slideDirectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="flex flex-row items-center gap-2 text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            <BookOpen size={36} className="text-primary animate-pulse shrink-0"/>
            {t.blog.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.blog.subtitle}
          </p>
        </div>

        {/* Article Stack */}
        {filteredArticles.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-4xl"
          >
            {filteredArticles.map((article) => (
              <motion.article
                key={article.slug}
                variants={itemVariants}
                className="group p-6 rounded-2xl border border-border/30 bg-muted/5 hover:bg-muted/10 hover:border-primary/25 transition-all duration-300 relative focus-within:ring-2 focus-within:ring-primary/40 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 min-w-0">
                  {/* Meta: Date, Read Time, Tags */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readTime}
                    </span>
                    <div className="flex gap-2">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-primary font-bold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg md:text-xl font-bold font-mono text-foreground mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${article.slug}`} className="focus:outline-none">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl">
                    {article.description}
                  </p>
                </div>

                {/* Navigation Arrow */}
                <div className="self-end md:self-auto flex items-center justify-center p-3 rounded-full border border-border/50 bg-background text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 shrink-0">
                  <ArrowRight size={18} />
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground font-mono">{t.blog.noArticles}</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
