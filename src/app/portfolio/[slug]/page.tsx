import { getProjectSlugs, getProjectBySlug, getProjectLanguageAlternates } from "@lib/mdx";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Globe, Calendar, Tag, Star, AlertCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { dictionaries, Language } from "@locales/dictionary";
import { getStatusConfig } from "@lib/status";
import { TableOfContents } from "@components/layout/TableOfContents";
import { StickyBackButton } from "@components/layout/StickyBackButton";
import { fetchRepoDetails } from "@lib/github";
import { Footer } from "@components/layout/Footer";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; tags?: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const { metadata } = project;
  const canonical = `/portfolio/${slug}`;
  const alternateSlugs = getProjectLanguageAlternates(slug);
  const languages: Record<string, string> = {};
  if (alternateSlugs.en) languages["en"] = `/portfolio/${alternateSlugs.en}`;
  if (alternateSlugs.pl) languages["pl"] = `/portfolio/${alternateSlugs.pl}`;

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
      tags: metadata.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
  };
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const { from, tags } = await searchParams;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const { metadata, Component } = project;
  const t = dictionaries[(metadata.language as Language) ?? "en"];
  const statusConfig = getStatusConfig(metadata.status, metadata.language);
  const repoDetails = metadata.githubUrl ? await fetchRepoDetails(metadata.githubUrl) : null;
  const starsCount = repoDetails?.stars ?? 0;

  const backHref =
    from === "explore" && tags
      ? {
          pathname: "/explore",
          query: { tags },
        }
      : "/portfolio";
  const backLabel = from === "explore" && tags ? "Back to Explore" : t.portfolio.backToProjects;

  return (
    <main className="min-h-full bg-background flex flex-col justify-between w-full pt-24 pb-8">
      <div className="max-w-6xl w-full mx-auto px-6 lg:grid lg:grid-cols-[1fr_250px] lg:gap-12 lg:items-start flex-1 mb-16">
        {/* Main Content */}
        <div className="max-w-4xl w-full">
          {/* Back Button */}
          <StickyBackButton href={backHref} label={backLabel} />

          {/* Article Header */}
          <div className="border-b border-border/40 pb-8 mb-10">
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {metadata.category}
              </span>
              {statusConfig && (
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${statusConfig.className}`}
                >
                  <statusConfig.icon size={13} />
                  {statusConfig.label}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-mono mb-4">
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

              {/* Links */}
              <div className="flex flex-wrap items-center gap-5 ml-auto text-sm md:text-base font-bold">
                {metadata.githubUrl && (
                  <>
                    <a
                      href={metadata.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary hover:underline text-foreground transition-colors"
                    >
                      <FaGithub size={18} className="inline-block" />
                      <span>Code</span>
                    </a>
                    <a
                      href={metadata.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary no-underline text-foreground transition-colors "
                    >
                      {starsCount > 0 && (
                        <span className="flex items-center gap-0.5 text-xs font-mono font-bold text-muted-foreground ml-1.5 no-underline bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                          <Star size={15} className="fill-current text-yellow-500" />
                          <span className="no-underline">{starsCount}</span>
                        </span>
                      )}
                    </a>
                    <a
                      href={`${metadata.githubUrl}/issues`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary hover:underline text-foreground transition-colors"
                    >
                      <AlertCircle size={15} />
                      Issues
                    </a>
                  </>
                )}
                {metadata.liveUrl && (
                  <a
                    href={metadata.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-primary hover:underline text-foreground transition-colors"
                  >
                    <Globe size={18} />
                    Live Demo
                  </a>
                )}
              </div>
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
        </div>

        {/* Sidebar: Sticky Table of Contents */}
        <TableOfContents label={t.portfolio.onThisPage} />
      </div>
      <Footer />
    </main>
  );
}
