"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/navigation";
import { MainSlider } from "./MainSlider";
import { PageTransition } from "./PageTransition";
import { ProjectMetadata, ArticleMetadata } from "@/lib/mdx";
import type { LastFmNowPlaying } from "@/lib/lastfm";

interface AppLayoutProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  nowPlaying?: LastFmNowPlaying;
  children: React.ReactNode;
}

export function AppLayout({ projects, articles, nowPlaying, children }: AppLayoutProps) {
  const pathname = usePathname() ?? "/";
  const isMainRoute = ROUTES.includes(pathname);

  return (
    <>
      {isMainRoute ? (
        <MainSlider
          projects={projects}
          articles={articles}
          activePathname={pathname}
          nowPlaying={nowPlaying}
        />
      ) : (
        <PageTransition>{children}</PageTransition>
      )}
    </>
  );
}
