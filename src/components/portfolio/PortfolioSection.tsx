"use client";

import React, { useState } from "react";
import { useLanguage } from "@context/LanguageContext";
import { ProjectMetadata } from "@lib/mdx";
import { Folder, ArrowUpRight, Cpu, Code2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { getStatusConfig } from "@lib/status";

interface PortfolioSectionProps {
  projects: ProjectMetadata[];
}

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter projects by current language and then by category
  const filteredProjects = projects.filter((project) => {
    const langMatch = project.language === language;
    if (!langMatch) return false;

    if (activeFilter === "all") return true;
    return project.category === activeFilter;
  });

  const filters = [
    { label: t.portfolio.all, id: "all" },
    { label: t.portfolio.ai, id: "ai", icon: Cpu },
    { label: t.portfolio.dev, id: "dev", icon: Code2 },
    { label: t.portfolio.qa, id: "qa", icon: ShieldAlert },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 1, scale: 1, y: 0 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } },
  };

  const slideDirectionVariants: Variants = {
    hidden: {
      opacity: 1,
      scale: 1,
      x: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, type: "spring", stiffness: 60 },
    },
  };

  return (
    <section
      id="portfolio"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col bg-background border-r border-border/40 relative pt-6 pb-20 md:py-32"
    >
      <motion.div
        variants={slideDirectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="max-w-7xl mx-auto px-6 w-full"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="flex flex-row items-center gap-2 text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              <Folder size={36} className="text-primary animate-pulse shrink-0" />
              {t.portfolio.title}
            </h2>
            <p className="text-sm text-muted-foreground">{t.portfolio.subtitle}</p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2 md:self-end">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all duration-300 flex items-center gap-1.5 focus:outline-none ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]"
                      : "border-border/60 text-muted-foreground bg-muted/20 hover:bg-muted/50 hover:border-border"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const statusConfig = getStatusConfig(project.status, language);
              return (
                <motion.div
                  key={project.slug}
                  variants={cardVariants}
                  layout
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="group p-6 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/15 transition-all duration-300 flex flex-col justify-between h-[280px] relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    aria-label={project.title}
                  >
                    {/* Background soft gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Card Header: Category & Icons */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/15">
                            {project.category}
                          </span>
                          {statusConfig && (
                            <span
                              className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${statusConfig.className}`}
                            >
                              <statusConfig.icon size={10} />
                              {statusConfig.label}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                          {project.category === "ai" ? (
                            <Cpu size={18} />
                          ) : project.category === "qa" ? (
                            <ShieldAlert size={18} />
                          ) : (
                            <Code2 size={18} />
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-bold font-mono text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-mono px-2 py-0.5 rounded bg-background border border-border/40 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center justify-between border-t border-border/30 pt-4 text-xs font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                        <span>{t.portfolio.viewProject}</span>
                        <ArrowUpRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center border border-dashed border-border/60 rounded-2xl max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground font-mono">
              No projects found for this selection.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
