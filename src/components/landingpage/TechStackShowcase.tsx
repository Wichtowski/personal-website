"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Layers3,
  Monitor,
  ScanSearch,
  Sparkles,
  Server,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { setNavDirection } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { TECH_STACK_ITEMS } from "@/lib/tech-stack";

const techIcons: Record<
  "monitor" | "sparkles" | "server" | "layers" | "wrench" | "brain" | "scan" | "database",
  React.ComponentType<{ size?: number; className?: string }>
> = {
  monitor: Monitor,
  sparkles: Sparkles,
  server: Server,
  layers: Layers3,
  wrench: Wrench,
  brain: Brain,
  scan: ScanSearch,
  database: Database,
};

const CATEGORY_LAYOUT: Record<
  string,
  {
    lightClassName: string;
    darkClassName: string;
    lightAccentClassName: string;
    darkAccentClassName: string;
  }
> = {
  llms: {
    lightClassName:
      "lg:col-span-7 lg:row-span-2 min-h-[23rem] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))]",
    darkClassName:
      "lg:col-span-7 lg:row-span-2 min-h-[23rem] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_35%),linear-gradient(180deg,rgba(10,10,14,0.98),rgba(6,6,9,0.96))]",
    lightAccentClassName: "from-violet-500/15 via-fuchsia-500/8 to-transparent",
    darkAccentClassName: "from-violet-500/20 via-fuchsia-500/10 to-transparent",
  },
  "computer-vision": {
    lightClassName:
      "lg:col-span-5 min-h-[23rem] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))]",
    darkClassName:
      "lg:col-span-5 min-h-[23rem] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(10,10,14,0.98),rgba(6,6,9,0.96))]",
    lightAccentClassName: "from-sky-500/15 via-cyan-500/8 to-transparent",
    darkAccentClassName: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  "deep-learning": {
    lightClassName: "lg:col-span-4 bg-white/90",
    darkClassName: "lg:col-span-4 bg-[#0f1015]",
    lightAccentClassName: "from-violet-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-violet-500/15 via-transparent to-transparent",
  },
  "data-science": {
    lightClassName: "lg:col-span-4 bg-white/90",
    darkClassName: "lg:col-span-4 bg-[#0f1015]",
    lightAccentClassName: "from-emerald-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-emerald-500/15 via-transparent to-transparent",
  },
  "backend-storage": {
    lightClassName: "lg:col-span-4 bg-white/90",
    darkClassName: "lg:col-span-4 bg-[#0f1015]",
    lightAccentClassName: "from-amber-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-amber-500/15 via-transparent to-transparent",
  },
  frontend: {
    lightClassName: "lg:col-span-4 bg-white/90",
    darkClassName: "lg:col-span-4 bg-[#0f1015]",
    lightAccentClassName: "from-pink-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-pink-500/15 via-transparent to-transparent",
  },
  "quality-delivery": {
    lightClassName: "lg:col-span-4 bg-white/90",
    darkClassName: "lg:col-span-4 bg-[#0f1015]",
    lightAccentClassName: "from-orange-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-orange-500/15 via-transparent to-transparent",
  },
  "languages-tools": {
    lightClassName: "lg:col-span-6 bg-white/90",
    darkClassName: "lg:col-span-6 bg-[#0f1015]",
    lightAccentClassName: "from-slate-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-slate-500/15 via-transparent to-transparent",
  },
  "current-os": {
    lightClassName: "lg:col-span-6 bg-white/90",
    darkClassName: "lg:col-span-6 bg-[#0f1015]",
    lightAccentClassName: "from-indigo-500/10 via-transparent to-transparent",
    darkAccentClassName: "from-indigo-500/15 via-transparent to-transparent",
  },
};

const cardOrder = [
  "llms",
  "computer-vision",
  "deep-learning",
  "data-science",
  "backend-storage",
  "frontend",
  "quality-delivery",
  "languages-tools",
  "current-os",
] as const;

export function TechStackShowcase() {
  const { t } = useLanguage();
  const techStack = t.techStack;
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";
  const categoriesByKey = new Map(techStack.categories.map((category) => [category.key, category]));
  const orderedCategories = cardOrder
    .map((key) => categoriesByKey.get(key))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-7 sm:py-8",
          isDarkTheme
            ? "border-white/10 bg-[#07070a] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            : "border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            isDarkTheme
              ? "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_28%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_28%)]",
          )}
        />
        <div
          className={cn(
            "absolute -top-24 right-10 h-44 w-44 rounded-full blur-3xl pointer-events-none",
            isDarkTheme ? "bg-violet-500/10" : "bg-violet-500/8",
          )}
        />
        <div
          className={cn(
            "absolute -bottom-24 left-6 h-52 w-52 rounded-full blur-3xl pointer-events-none",
            isDarkTheme ? "bg-sky-500/10" : "bg-sky-500/8",
          )}
        />

        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p
              className={cn(
                "mb-3 text-xs font-mono uppercase tracking-[0.35em]",
                isDarkTheme ? "text-white/45" : "text-slate-500",
              )}
            >
              {techStack.eyebrow}
            </p>
            <h2
              className={cn(
                "text-3xl md:text-4xl font-extrabold font-mono tracking-tight",
                isDarkTheme ? "text-white" : "text-slate-950",
              )}
            >
              {techStack.heading}
            </h2>
            <p
              className={cn(
                "mt-3 max-w-xl text-sm md:text-base leading-relaxed",
                isDarkTheme ? "text-white/60" : "text-slate-600",
              )}
            >
              LLMs and applied computer vision are the core. The rest is the delivery stack that
              makes it shippable.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["LLMs", "Computer Vision", "Data", "Delivery"].map((pill) => (
              <span
                key={pill}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] shadow-sm",
                  isDarkTheme
                    ? "border-white/10 bg-white/5 text-white/55"
                    : "border-slate-200 bg-white/80 text-slate-500",
                )}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12"
        >
          {orderedCategories.map((category) => {
            const Icon = techIcons[category.icon];
            const items = TECH_STACK_ITEMS[category.key as keyof typeof TECH_STACK_ITEMS] ?? [];
            const layout = CATEGORY_LAYOUT[category.key] ?? {
              lightClassName: "lg:col-span-4 bg-white/90",
              darkClassName: "lg:col-span-4 bg-[#0f1015]",
              lightAccentClassName: "from-primary/15 via-transparent to-transparent",
              darkAccentClassName: "from-primary/15 via-transparent to-transparent",
            };
            const isFeatured = category.key === "llms" || category.key === "computer-vision";
            const cardClassName = isDarkTheme ? layout.darkClassName : layout.lightClassName;
            const accentClassName = isDarkTheme
              ? layout.darkAccentClassName
              : layout.lightAccentClassName;

            return (
              <motion.article
                key={category.key}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.98 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
                className={cn(
                  "group relative overflow-hidden rounded-[1.75rem] border p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1",
                  isDarkTheme
                    ? "border-white/10 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:border-white/20 hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
                    : "border-slate-200/80 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:border-primary/25 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]",
                  cardClassName,
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity duration-500",
                    accentClassName,
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-px rounded-[1.65rem]",
                    isDarkTheme ? "bg-[#0c0c0f]/96" : "bg-white/96",
                  )}
                />
                <div className="relative flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                          isDarkTheme
                            ? "border border-white/10 bg-white/5 text-primary"
                            : "border border-slate-200 bg-white/90 text-primary",
                        )}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={cn(
                              "font-mono font-bold uppercase tracking-[0.22em]",
                              isDarkTheme ? "text-white" : "text-slate-950",
                              isFeatured ? "text-base sm:text-lg" : "text-sm",
                            )}
                          >
                            {category.title}
                          </h3>
                        </div>
                        <p
                          className={cn(
                            "mt-2 max-w-xl text-sm leading-relaxed",
                            isDarkTheme ? "text-white/60" : "text-slate-600",
                          )}
                        >
                          {category.summary}
                        </p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                        isDarkTheme
                          ? "border-white/10 bg-white/5 text-white/55"
                          : "border-slate-200 bg-white/85 text-slate-500",
                      )}
                    >
                      {items.length}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-wrap content-start gap-2">
                    {items.map((item, index) => (
                      <Link
                        key={item}
                        href={{ pathname: "/articles", query: { tag: item } }}
                        onClick={() => setNavDirection(1)}
                        className={cn(
                          "group/item inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono transition-all duration-300",
                          isDarkTheme
                            ? "border-white/10 bg-white/5 text-white/80 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                            : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/8 hover:text-slate-950",
                          "shadow-sm",
                          index === 0 && isFeatured
                            ? isDarkTheme
                              ? "bg-violet-500/15 border-violet-400/25 text-white"
                              : "bg-violet-500/10 border-violet-400/20 text-slate-950"
                            : "",
                        )}
                      >
                        <span>{item}</span>
                        <ArrowUpRight
                          size={12}
                          className="transition-transform duration-300 group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5"
                        />
                      </Link>
                    ))}
                  </div>

                  {isFeatured ? (
                    <div
                      className={cn(
                        "mt-auto h-px w-full bg-gradient-to-r",
                        isDarkTheme
                          ? "from-white/10 via-white/20 to-transparent"
                          : "from-slate-200 via-slate-300 to-transparent",
                      )}
                    />
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
