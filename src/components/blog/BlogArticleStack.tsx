import { motion, Variants } from "framer-motion";
import { ArticleMetadata } from "@lib/mdx";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@lib/date";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Language } from "@locales/dictionary";

interface BlogArticleStackProps {
  articles: ArticleMetadata[];
  language: Language;
  containerVariants: Variants;
  itemVariants: Variants;
}

export function BlogArticleStack({
  articles,
  language,
  containerVariants,
  itemVariants,
}: BlogArticleStackProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl"
    >
      {articles.map((article) => (
        <motion.article
          key={article.slug}
          variants={itemVariants}
          className="group p-6 rounded-2xl border border-border/30 bg-muted/5 hover:bg-muted/10 hover:border-primary/25 transition-all duration-300 relative focus-within:ring-2 focus-within:ring-primary/40 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(article.date, language, {
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

            <h3 className="text-lg md:text-xl font-bold font-mono text-foreground mb-2 group-hover:text-primary transition-colors">
              <Link href={`/blog/${article.slug}`} className="focus:outline-none">
                {article.title}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl">
              {article.description}
            </p>
          </div>

          <div className="self-end md:self-auto flex items-center justify-center p-3 rounded-full border border-border/50 bg-background text-muted-foreground group-hover:border-primary group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 shrink-0">
            <ArrowRight size={18} />
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
