"use client";

import React from "react";
import { Layers3, Monitor, Sparkles, Server, Wrench } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const techIcons: Record<
  "monitor" | "sparkles" | "server" | "layers" | "wrench",
  React.ComponentType<{ size?: number; className?: string }>
> = {
  monitor: Monitor,
  sparkles: Sparkles,
  server: Server,
  layers: Layers3,
  wrench: Wrench,
};

export function TechStackShowcase() {
  const { t } = useLanguage();
  const techStack = t.techStack;

  return (
    <section className="w-full max-w-5xl mx-auto px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
            {techStack.eyebrow}
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold font-mono tracking-tight text-foreground">
            {techStack.heading}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {techStack.categories.map((category) => {
          const Icon = techIcons[category.icon];

          return (
            <article
              key={category.key}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-muted/5 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-muted/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/40 bg-background/80 text-primary shadow-sm">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-foreground">
                      {category.title}
                    </h3>
                    <span className="rounded-full border border-border/40 bg-background/80 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                      {category.items.length}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {category.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border/40 bg-background/70 px-3 py-1 text-xs font-mono text-foreground/90 transition-colors duration-300 hover:border-primary/20 hover:bg-primary/8 hover:text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
