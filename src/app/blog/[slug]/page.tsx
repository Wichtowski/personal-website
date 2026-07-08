import { getArticleSlugs, getArticleBySlug, getArticleLanguageAlternates } from "@lib/mdx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Clock, Tag } from "lucide-react";
import { dictionaries, Language } from "@locales/dictionary";
import { TableOfContents } from "@components/layout/TableOfContents";
import { StickyBackButton } from "@components/layout/StickyBackButton";
import { EndorsementButton, CommentsSection } from "@components/engagement";
import { SITE_URL, AUTHOR_NAME } from "@lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; tags?: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const { metadata } = article;
  const canonical = `/blog/${slug}`;
  const alternateSlugs = getArticleLanguageAlternates(slug);
  const languages: Record<string, string> = {};
  if (alternateSlugs.en) languages["en"] = `/blog/${alternateSlugs.en}`;
  if (alternateSlugs.pl) languages["pl"] = `/blog/${alternateSlugs.pl}`;

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      canonical,
      languages: Object.keys(languages).length > 0 ? languages : undefined,
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      publishedTime: metadata.date,
      authors: [AUTHOR_NAME],
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
  };
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { from, tags } = await searchParams;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const { metadata, Component } = article;
  const t = dictionaries[(metadata.language as Language) ?? "en"];
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    inLanguage: metadata.language,
    keywords: metadata.tags,
    url: `${SITE_URL}/blog/${resolvedParams.slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
  };
  const backHref =
    from === "explore" && tags
      ? {
          pathname: "/explore",
          query: { tags },
        }
      : "/articles";
  const backLabel = from === "explore" && tags ? "Back to Explore" : t.blog.backToArticles;

  return (
    <main className="min-h-full bg-background flex flex-col justify-between w-full pt-24 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-6xl w-full mx-auto px-6 lg:grid lg:grid-cols-[1fr_250px] lg:gap-12 lg:items-start flex-1 mb-16">
        {/* Main Content */}
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <StickyBackButton href={backHref} label={backLabel} />

          {/* Article Header */}
          <div className="border-b border-border/40 pb-8 mb-10">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-mono mb-4 leading-tight">
              {metadata.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {metadata.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(metadata.date).toLocaleDateString(
                  metadata.language === "pl" ? "pl-PL" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {metadata.readTime}
              </span>
            </div>
          </div>

          {/* MDX Body Content */}
          <article className="prose dark:prose-invert prose-primary max-w-none prose-mono prose-headings:font-mono prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-p:leading-relaxed prose-pre:bg-muted/15 prose-pre:border prose-pre:border-border/40 prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-semibold prose-strong:text-foreground">
            <Component />
          </article>

          {/* Footer tags */}
          <div className="border-t border-border/30 mt-16 pt-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-muted-foreground" />
              {metadata.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-muted-foreground bg-muted/20 border border-border/40 px-2 py-0.5 rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Endorsement & Comment system */}
          <EndorsementButton targetId={`blog:${resolvedParams.slug}`} />
          <CommentsSection targetId={`blog:${resolvedParams.slug}`} />
        </div>

        {/* Sidebar: Sticky Table of Contents */}
        <TableOfContents label={t.blog.onThisPage} />
      </div>
    </main>
  );
}
