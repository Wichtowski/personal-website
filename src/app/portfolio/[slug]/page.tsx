import React from "react";
import { getProjectSlugs, getProjectBySlug } from "@lib/mdx";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { dictionaries, Language } from "@locales/dictionary";
import { getStatusConfig } from "@lib/status";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; tags?: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
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
  const backHref =
    from === "explore" && tags
      ? {
          pathname: "/explore",
          query: { tags },
        }
      : "/portfolio";
  const backLabel = from === "explore" && tags ? "Back to Explore" : t.portfolio.backToProjects;

  return (
    <main className="h-full overflow-y-auto no-scrollbar py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-mono font-bold text-muted-foreground hover:text-primary transition-colors mb-12 focus:outline-none"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </Link>

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
            <div className="flex gap-4 ml-auto">
              {metadata.githubUrl && (
                <a
                  href={metadata.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary hover:underline"
                >
                  <FaGithub size={14} className="inline-block" />
                  Code
                </a>
              )}
              {metadata.liveUrl && (
                <a
                  href={metadata.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary hover:underline"
                >
                  <Globe size={14} />
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
    </main>
  );
}
