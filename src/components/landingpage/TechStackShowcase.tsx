"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@context/LanguageContext";
import { useThemeMode } from "@hooks/useThemeMode";
import { setNavDirection } from "@lib/navigation";
import { cn } from "@lib/cn";
import {
  TECH_STACK_DOMAINS,
  TECH_STACK_ITEMS,
  type TechStackDomainKey,
  type TechStackItem,
} from "@lib/tech-stack";

export function TechStackShowcase() {
  const { t } = useLanguage();
  const techStack = t.techStack;
  const themeMode = useThemeMode("dark");
  const [activeDomainKey, setActiveDomainKey] = useState<TechStackDomainKey>("frontend");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [panelMinHeight, setPanelMinHeight] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingScrollTopRef = useRef<number | null>(null);
  const isDarkTheme = themeMode === "dark";

  const tabsByKey = new Map(techStack.tabs.map((tab) => [tab.key, tab]));
  const subcategoriesByKey = new Map(
    techStack.subcategories.map((subcategory) => [subcategory.key, subcategory]),
  );
  const activeDomain =
    TECH_STACK_DOMAINS.find((domain) => domain.key === activeDomainKey) ?? TECH_STACK_DOMAINS[0];
  const activeTab = tabsByKey.get(activeDomain.key);
  const activeItemCount = new Set(activeDomain.sections.flatMap((section) => section.items)).size;
  const selectedItemSet = useMemo(() => new Set(selectedItems), [selectedItems]);
  const exploreHref = useMemo(
    () => ({
      pathname: "/explore",
      query: { tags: selectedItems.join(",") },
    }),
    [selectedItems],
  );

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const panelHeight = panel.getBoundingClientRect().height;
    setPanelMinHeight((currentHeight) => Math.max(currentHeight, panelHeight));

    const scrollContainer = document.getElementById("main-content");
    if (scrollContainer && pendingScrollTopRef.current !== null) {
      scrollContainer.scrollTop = pendingScrollTopRef.current;
      pendingScrollTopRef.current = null;
    }
  }, [activeDomain.key]);

  const changeActiveDomain = (domainKey: TechStackDomainKey) => {
    const scrollContainer = document.getElementById("main-content");
    pendingScrollTopRef.current = scrollContainer?.scrollTop ?? null;
    setActiveDomainKey(domainKey);
  };

  const toggleSelectedItem = (label: string) => {
    setSelectedItems((currentItems) =>
      currentItems.includes(label)
        ? currentItems.filter((item) => item !== label)
        : [...currentItems, label],
    );
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div
        className={cn(
          "relative overflow-hidden rounded-[2rem] border px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-7 sm:py-8",
          isDarkTheme
            ? "border-white/10 bg-[#07070a] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            : "border-slate-200/80 bg-white/95",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            isDarkTheme
              ? "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.13),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.09),transparent_30%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.05),transparent_30%)]",
          )}
        />

        <div className="relative">
          <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p
                className={cn(
                  "mb-3 text-xs font-mono uppercase tracking-[0.35em]",
                  isDarkTheme ? "text-white/70" : "text-slate-600",
                )}
              >
                {techStack.eyebrow}
              </p>
              <h2
                className={cn(
                  "text-3xl font-extrabold font-mono tracking-tight md:text-4xl",
                  isDarkTheme ? "text-white" : "text-slate-950",
                )}
              >
                {techStack.heading}
              </h2>
              <p
                className={cn(
                  "mt-3 max-w-xl text-sm leading-relaxed",
                  isDarkTheme ? "text-white/60" : "text-slate-600",
                )}
              >
                {techStack.selectionHint}
              </p>
            </div>
            <p
              className={cn(
                "shrink-0 font-mono text-xs uppercase tracking-[0.2em]",
                isDarkTheme ? "text-white/45" : "text-slate-500",
              )}
            >
              {activeItemCount} {techStack.toolCount}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={techStack.tabListLabel}
            className={cn(
              "mt-7 flex gap-1 overflow-x-auto rounded-2xl border p-1.5 no-scrollbar",
              isDarkTheme ? "border-white/10 bg-black/25" : "border-slate-200 bg-slate-100/80",
            )}
          >
            {TECH_STACK_DOMAINS.map((domain) => {
              const tab = tabsByKey.get(domain.key);
              const DomainIcon = domain.icon;
              const isActive = domain.key === activeDomain.key;

              return (
                <button
                  key={domain.key}
                  id={`tech-tab-${domain.key}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="tech-tab-panel"
                  onClick={() => changeActiveDomain(domain.key)}
                  className={cn(
                    "relative flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:px-4",
                    isActive
                      ? isDarkTheme
                        ? "bg-white/10 text-white shadow-sm"
                        : "bg-white text-slate-950 shadow-sm"
                      : isDarkTheme
                        ? "text-white/45 hover:bg-white/5 hover:text-white/80"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-800",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="active-tech-tab"
                      className={cn(
                        "absolute inset-x-3 -bottom-1.5 h-0.5 rounded-full",
                        isDarkTheme ? "bg-primary" : "bg-primary",
                      )}
                    />
                  ) : null}
                  <DomainIcon size={16} aria-hidden={true} />
                  <span>{tab?.title ?? domain.key}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex min-h-11 items-start text-left">
            <div>
              <p
                className={cn(
                  "font-mono text-sm font-bold uppercase tracking-[0.18em]",
                  isDarkTheme ? "text-white" : "text-slate-950",
                )}
              >
                {activeTab?.title}
              </p>
              <p
                className={cn(
                  "mt-1 text-sm leading-relaxed",
                  isDarkTheme ? "text-white/50" : "text-slate-600",
                )}
              >
                {activeTab?.description}
              </p>
            </div>
          </div>

          <motion.div
            key={activeDomain.key}
            ref={panelRef}
            id="tech-tab-panel"
            role="tabpanel"
            aria-labelledby={`tech-tab-${activeDomain.key}`}
            style={panelMinHeight ? { minHeight: panelMinHeight } : undefined}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2"
          >
            {activeDomain.sections.map((section) => {
              const SectionIcon = section.icon;
              const localizedSection = subcategoriesByKey.get(section.key);

              return (
                <article
                  key={section.key}
                  className={cn(
                    "rounded-[1.4rem] border p-4 text-left sm:p-5",
                    section.wide && "md:col-span-2",
                    isDarkTheme
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-slate-200/90 bg-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.05)]",
                  )}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        isDarkTheme
                          ? "border border-white/10 bg-white/5 text-primary"
                          : "border border-slate-200 bg-white text-primary",
                      )}
                    >
                      <SectionIcon size={17} aria-hidden={true} />
                    </div>
                    <h3
                      className={cn(
                        "font-mono text-xs font-bold uppercase tracking-[0.2em]",
                        isDarkTheme ? "text-white/85" : "text-slate-800",
                      )}
                    >
                      {localizedSection?.title ?? section.key}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {section.items.map((label) => {
                      const item: TechStackItem = TECH_STACK_ITEMS[label];

                      const isSelected = selectedItemSet.has(item.label);

                      return (
                        <button
                          key={item.label}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleSelectedItem(item.label)}
                          className={cn(
                            "inline-flex max-w-full items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-mono transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            isDarkTheme
                              ? "border-white/10 bg-black/20 text-white/75 hover:border-white/20 hover:bg-white/8 hover:text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:text-slate-950",
                            isSelected &&
                              (isDarkTheme
                                ? "border-primary/55 bg-primary/20 text-white"
                                : "border-primary/50 bg-primary/10 text-slate-950"),
                          )}
                        >
                          <span className="flex h-5 w-5 items-center justify-center">
                            {isSelected ? (
                              <Check size={15} className="text-primary" aria-hidden={true} />
                            ) : (
                              <item.icon
                                size={item.iconSize ?? 18}
                                className={cn("shrink-0", item.iconClassName)}
                                aria-hidden={true}
                              />
                            )}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>
      </div>

      {selectedItems.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, x: "calc(100% + 2rem)" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.9 }}
          className="fixed bottom-24 right-6 z-50 md:bottom-28 md:right-8"
        >
          <Link
            href={exploreHref}
            onClick={() => setNavDirection(1)}
            className={cn(
              "inline-flex items-center gap-2.5 rounded-full border px-5 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.18em] shadow-lg backdrop-blur-xl transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              isDarkTheme
                ? "border-white/15 bg-[#07070a]/90 text-white shadow-black/30 hover:border-white/25"
                : "border-primary/20 bg-white/90 text-slate-950 shadow-slate-900/10 hover:border-primary/35",
            )}
          >
            <span>{techStack.exploreLabel}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                isDarkTheme ? "bg-white/10" : "bg-slate-100",
              )}
            >
              {selectedItems.length}
            </span>
            <ArrowRight size={16} aria-hidden={true} />
          </Link>
        </motion.div>
      ) : null}
    </section>
  );
}
