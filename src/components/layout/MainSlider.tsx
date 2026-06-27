"use client";

import React from "react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/navigation";
import { ProjectMetadata, ArticleMetadata } from "@/lib/mdx";
import { Hero } from "@/components/landingpage/hero/Hero";
import GithubPageClient from "@/app/github/page-client";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { ContactSection } from "@/components/contact/ContactSection";

interface MainSliderProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  activePathname: string;
  children?: React.ReactNode;
}

export function MainSlider({ projects, articles, activePathname, children }: MainSliderProps) {
  const activeIndex = ROUTES.indexOf(activePathname);
  const index = activeIndex === -1 ? 0 : activeIndex;
  const homeSlide = activePathname === "/" && children ? children : <Hero />;
  const articlesSlide =
    activePathname === "/articles" && children ? children : <BlogSection articles={articles} />;

  return (
    <div className="w-screen h-[calc(100vh-5rem)] mt-16 md:mt-0 md:h-screen overflow-hidden relative bg-background">
      <motion.div
        initial={false}
        animate={{ x: `-${index * 100}vw` }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
        className="flex h-full w-[500vw]"
      >
        <div className="w-screen h-full shrink-0">{homeSlide}</div>
        <div className="w-screen h-full shrink-0">
          <GithubPageClient initialData={null} />
        </div>
        <div className="w-screen h-full shrink-0">
          <PortfolioSection projects={projects} />
        </div>
        <div className="w-screen h-full shrink-0">{articlesSlide}</div>
        <div className="w-screen h-full shrink-0">
          <ContactSection />
        </div>
      </motion.div>
    </div>
  );
}
