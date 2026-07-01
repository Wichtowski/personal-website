"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLanguage } from "@context/LanguageContext";
import type { TranslationDict } from "@locales/dictionary";
import { setNavDirection } from "@lib/navigation";
import { cn } from "@lib/cn";
import { TECH_STACK_GROUPS, TECH_STACK_SECTIONS } from "@lib/tech-stack";

export function TechStackShowcase() {
  const { t } = useLanguage();
  const techStack = t.techStack;
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";
  const groupsByKey = new Map(techStack.groups.map((group) => [group.key, group]));
  const categoriesByKey = new Map(techStack.categories.map((category) => [category.key, category]));
  type LocalizedGroup = TranslationDict["techStack"]["groups"][number];
  type LocalizedCategory = TranslationDict["techStack"]["categories"][number];
  type OrderedSection = (typeof TECH_STACK_SECTIONS)[number] & { category: LocalizedCategory };
  type OrderedGroup = (typeof TECH_STACK_GROUPS)[number] &
    LocalizedGroup & {
      sections: OrderedSection[];
    };

  const orderedGroups = TECH_STACK_GROUPS.map((group): OrderedGroup | null => {
    const localizedGroup = groupsByKey.get(group.key);
    const sections = TECH_STACK_SECTIONS.filter((section) => section.group === group.key)
      .map((section) => {
        const category = categoriesByKey.get(section.key);
        return category ? { ...section, category } : null;
      })
      .filter((section): section is OrderedSection => Boolean(section));

    return localizedGroup && sections.length
      ? {
          ...group,
          ...localizedGroup,
          sections,
        }
      : null;
  }).filter((group): group is OrderedGroup => Boolean(group));
  const regularGroups = orderedGroups.filter((group) => group.sections.length > 1);
  const compactGroups = orderedGroups.filter((group) => group.sections.length === 1);

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

        <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-center">
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
          </div>
        </div>

        <div className="space-y-8">
          {regularGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <section key={group.key} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                      isDarkTheme
                        ? "border border-white/10 bg-white/5 text-primary"
                        : "border border-slate-200 bg-white/90 text-primary",
                    )}
                  >
                    <GroupIcon size={30} />
                  </div>
                  <div className="max-w-2xl">
                    <h3
                      className={cn(
                        "font-mono text-lg font-bold uppercase tracking-[0.22em]",
                        isDarkTheme ? "text-white" : "text-slate-950",
                      )}
                    >
                      {group.title}
                    </h3>
                    {group.description && (
                      <p
                        className={cn(
                          "mt-2 text-sm leading-relaxed sm:text-base",
                          isDarkTheme ? "text-white/60" : "text-slate-600",
                        )}
                      >
                        {group.description}
                      </p>
                    )}
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
                  {group.sections.map((section) => {
                    const SectionIcon = section.icon;
                    const items = section.items;
                    const category = section.category;
                    const layout = section.layout;
                    const isFeatured = section.key === "llms" || section.key === "computer-vision";
                    const cardClassName = isDarkTheme
                      ? layout.darkClassName
                      : layout.lightClassName;
                    const accentClassName = isDarkTheme
                      ? layout.darkAccentClassName
                      : layout.lightAccentClassName;

                    return (
                      <motion.article
                        key={section.key}
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
                        <div className="relative flex flex-col gap-5">
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
                                <SectionIcon size={20} />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4
                                    className={cn(
                                      "font-mono font-bold uppercase tracking-[0.22em]",
                                      isDarkTheme ? "text-white" : "text-slate-950",
                                      isFeatured ? "text-base sm:text-lg" : "text-sm",
                                    )}
                                  >
                                    {category.title}
                                  </h4>
                                </div>
                                {category.summary && (
                                  <p
                                    className={cn(
                                      "mt-2 max-w-xl text-sm leading-relaxed",
                                      isDarkTheme ? "text-white/60" : "text-slate-600",
                                    )}
                                  >
                                    {category.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-wrap content-start gap-1.5">
                            {items.map((item, itemIndex) => (
                              <Link
                                key={item.label}
                                href={{ pathname: "/articles", query: { tag: item.label } }}
                                onClick={() => setNavDirection(1)}
                                className={cn(
                                  "group/item inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-mono transition-all duration-300 whitespace-nowrap shadow-sm",
                                  isDarkTheme
                                    ? "border-white/10 bg-white/5 text-white/80 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/8 hover:text-slate-950",
                                  itemIndex === 0 && isFeatured
                                    ? isDarkTheme
                                      ? "bg-violet-500/15 border-violet-400/25 text-white"
                                      : "bg-violet-500/10 border-violet-400/20 text-slate-950"
                                    : "",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-[0.4rem]",
                                  )}
                                >
                                  <item.icon
                                    size={item.iconSize ?? 18}
                                    className={cn("shrink-0", item.iconClassName)}
                                  />
                                </span>
                                <span>{item.label}</span>
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
              </section>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8">
          {compactGroups.map((group) => {
            const GroupIcon = group.icon;

            return (
              <section key={group.key} className="w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                      isDarkTheme
                        ? "border border-white/10 bg-white/5 text-primary"
                        : "border border-slate-200 bg-white/90 text-primary",
                    )}
                  >
                    <GroupIcon size={30} />
                  </div>
                  <div className="max-w-2xl">
                    <h3
                      className={cn(
                        "font-mono text-lg font-bold uppercase tracking-[0.22em]",
                        isDarkTheme ? "text-white" : "text-slate-950",
                      )}
                    >
                      {group.sections[0]?.category.title ?? group.title}
                    </h3>
                  </div>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.08 } },
                  }}
                  className="grid grid-cols-1 gap-4"
                >
                  {group.sections.map((section) => {
                    const items = section.items;
                    const category = section.category;
                    const layout = section.layout;
                    const isFeatured = section.key === "llms" || section.key === "computer-vision";
                    const cardClassName = isDarkTheme
                      ? layout.darkClassName
                      : layout.lightClassName;
                    const accentClassName = isDarkTheme
                      ? layout.darkAccentClassName
                      : layout.lightAccentClassName;

                    return (
                      <motion.article
                        key={section.key}
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
                        <div className="relative flex flex-col">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div>
                                {category.summary && (
                                  <p
                                    className={cn(
                                      "mt-2 max-w-xl text-sm leading-relaxed",
                                      isDarkTheme ? "text-white/60" : "text-slate-600",
                                    )}
                                  >
                                    {category.summary}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-1 flex-wrap content-start gap-1.5">
                            {items.map((item, itemIndex) => (
                              <Link
                                key={item.label}
                                href={{ pathname: "/articles", query: { tag: item.label } }}
                                onClick={() => setNavDirection(1)}
                                className={cn(
                                  "group/item inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[13px] font-mono transition-all duration-300 whitespace-nowrap shadow-sm",
                                  isDarkTheme
                                    ? "border-white/10 bg-white/5 text-white/80 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    : "border-slate-200 bg-white/80 text-slate-700 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/8 hover:text-slate-950",
                                  itemIndex === 0 && isFeatured
                                    ? isDarkTheme
                                      ? "bg-violet-500/15 border-violet-400/25 text-white"
                                      : "bg-violet-500/10 border-violet-400/20 text-slate-950"
                                    : "",
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-[0.4rem]",
                                  )}
                                >
                                  <item.icon
                                    size={item.iconSize ?? 18}
                                    className={cn("shrink-0", item.iconClassName)}
                                  />
                                </span>
                                <span>{item.label}</span>
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
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
