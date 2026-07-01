"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@lib/navigation";
import { MainSlider } from "./MainSlider";
import { PageTransition } from "./PageTransition";
import { ProjectMetadata, ArticleMetadata } from "@lib/mdx";

interface AppLayoutProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  children: React.ReactNode;
}

export function AppLayout({ projects, articles, children }: AppLayoutProps) {
  const pathname = usePathname() ?? "/";
  const isMainRoute = ROUTES.includes(pathname);

  return (
    <>
      {isMainRoute ? (
        <MainSlider projects={projects} articles={articles} activePathname={pathname}>
          {children}
        </MainSlider>
      ) : (
        <PageTransition>{children}</PageTransition>
      )}
    </>
  );
}
