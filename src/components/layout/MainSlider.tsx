"use client";

import React from "react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/navigation";
import { ProjectMetadata, ArticleMetadata } from "@/lib/mdx";
import { Hero } from "@/components/hero/Hero";
import GithubPageClient from "@/app/github/page-client";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import { BlogSection } from "@/components/blog/BlogSection";
import { ContactSection } from "@/components/contact/ContactSection";

interface MainSliderProps {
  projects: ProjectMetadata[];
  articles: ArticleMetadata[];
  activePathname: string;
}

export function MainSlider({ projects, articles, activePathname }: MainSliderProps) {
  const activeIndex = ROUTES.indexOf(activePathname);
  const index = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="w-screen h-[calc(100vh-5rem)] mt-16 md:mt-0 md:h-screen overflow-hidden relative bg-background">
      <motion.div
        animate={{ x: `-${index * 100}vw` }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.8 }}
        className="flex h-full w-[500vw]"
      >
        <div className="w-screen h-full shrink-0">
          <Hero />
        </div>
        <div className="w-screen h-full shrink-0">
          <GithubPageClient initialData={null} />
        </div>
        <div className="w-screen h-full shrink-0">
          <PortfolioSection projects={projects} />
        </div>
        <div className="w-screen h-full shrink-0">
          <BlogSection articles={articles} />
        </div>
        <div className="w-screen h-full shrink-0">
          <ContactSection />
        </div>
      </motion.div>
    </div>
  );
}
