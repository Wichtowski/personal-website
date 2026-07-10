"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Terminal, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeMode } from "@hooks/useThemeMode";
import { cn } from "@lib/cn";
import {
  getRouteDirection,
  PAGE_FADE_DURATION_MS,
  requestPageFadeOut,
  setNavDirection,
  setNavTransitionKind,
} from "@lib/navigation";

export function Navbar() {
  const { setTheme } = useTheme();
  const themeMode = useThemeMode("dark");
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let activeSection = "home";
  if (pathname.startsWith("/github")) {
    activeSection = "github";
  } else if (pathname.startsWith("/portfolio")) {
    activeSection = "portfolio";
  } else if (pathname.startsWith("/articles") || pathname.startsWith("/blog")) {
    activeSection = "articles";
  } else if (pathname.startsWith("/contact")) {
    activeSection = "contact";
  }
  const scrolled = pathname !== "/";
  const isDarkTheme = themeMode === "dark";

  const toggleTheme = () => {
    if (!themeMode) {
      return;
    }

    setTheme(isDarkTheme ? "light" : "dark");
  };

  const getLocalizedPageHref = (targetLanguage: typeof language) => {
    const alternateLink = document.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][hreflang="${targetLanguage}"]`,
    );
    const href = alternateLink?.getAttribute("href");

    if (!href) {
      return null;
    }

    const url = new URL(href, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  };

  const handleLanguageToggle = () => {
    const nextLanguage = language === "en" ? "pl" : "en";
    const localizedHref = getLocalizedPageHref(nextLanguage);

    setMobileMenuOpen(false);
    setLanguage(nextLanguage);

    if (localizedHref && localizedHref !== pathname) {
      setNavTransitionKind("fade");
      requestPageFadeOut();
      window.setTimeout(() => router.push(localizedHref), PAGE_FADE_DURATION_MS);
    }
  };

  const navItems = [
    { label: t.nav.home, id: "home" },
    { label: t.nav.github, id: "github" },
    { label: t.nav.portfolio, id: "portfolio" },
    { label: t.nav.articles, id: "articles" },
    { label: t.nav.contact, id: "contact" },
  ];

  const SECTION_TO_ROUTE: Record<string, string> = {
    home: "/",
    github: "/github",
    portfolio: "/portfolio",
    articles: "/articles",
    contact: "/contact",
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const target = SECTION_TO_ROUTE[id] ?? "/";
    setNavDirection(getRouteDirection(pathname, target));
    router.push(target);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 border-b backdrop-blur-md shadow-lg",
        isDarkTheme
          ? cn(
              "bg-black/75 text-white/90 border-white/10 shadow-black/20",
              scrolled ? "bg-black/80" : "bg-black/70",
            )
          : cn(
              "bg-white/95 text-slate-900 border-slate-200/80 shadow-slate-900/5",
              scrolled ? "bg-white/98" : "bg-white/95",
            ),
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => handleScrollTo("home")}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div
            className={cn(
              "p-2 rounded-lg transition-all",
              isDarkTheme
                ? "bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/25 group-hover:border-primary/40"
                : "bg-slate-100 border border-slate-200 text-slate-700 group-hover:bg-slate-200 group-hover:border-slate-300",
            )}
          >
            <Terminal size={18} />
          </div>
          <span
            className={cn(
              "font-mono text-sm tracking-widest font-bold",
              isDarkTheme ? "text-white" : "text-slate-900",
            )}
          >
            OSKAR.<span className="text-primary">WICHTOWSKI</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleScrollTo(item.id)}
                className={cn(
                  "text-sm font-medium transition-colors relative py-1 focus:outline-none group",
                  isActive
                    ? "text-primary"
                    : isDarkTheme
                      ? "text-white/65 hover:text-white"
                      : "text-slate-600 hover:text-slate-900",
                )}
              >
                {item.label}
                {isActive ? (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/40 transition-all duration-300 group-hover:w-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={handleLanguageToggle}
            className={cn(
              "p-2 rounded-lg transition-all duration-300 flex items-center gap-1.5 focus:outline-none text-xs font-mono font-medium",
              isDarkTheme
                ? "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white"
                : "border border-slate-200 bg-white/90 hover:bg-slate-100 hover:border-slate-300 text-slate-900",
            )}
            title="Toggle Language / Zmień język"
          >
            <Languages size={14} />
            {language.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          {themeMode && (
            <button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-lg transition-all duration-300 focus:outline-none",
                isDarkTheme
                  ? "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white"
                  : "border border-slate-200 bg-white/90 hover:bg-slate-100 hover:border-slate-300 text-slate-900",
              )}
              title="Toggle Theme"
            >
              {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "p-2 rounded-lg transition-all focus:outline-none",
              isDarkTheme
                ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                : "border border-slate-200 bg-white/90 text-slate-900 hover:bg-slate-100",
            )}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "md:hidden border-t backdrop-blur-md overflow-hidden",
              isDarkTheme ? "border-white/10 bg-black/90" : "border-slate-200/70 bg-white/98",
            )}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleScrollTo(item.id)}
                    className={cn(
                      "text-left py-2 text-base font-medium transition-all focus:outline-none",
                      isActive
                        ? "text-primary font-semibold pl-2 border-l-2 border-primary"
                        : isDarkTheme
                          ? "text-white/65 hover:text-white hover:pl-2"
                          : "text-slate-600 hover:text-slate-900 hover:pl-2",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div
                className={cn(
                  "flex items-center gap-2 pt-2 border-t",
                  isDarkTheme ? "border-white/10" : "border-slate-200/70",
                )}
              >
                <button
                  onClick={handleLanguageToggle}
                  className={cn(
                    "p-2 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 focus:outline-none transition-all",
                    isDarkTheme
                      ? "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white"
                      : "border border-slate-200 bg-white/90 hover:bg-slate-100 hover:border-slate-300 text-slate-900",
                  )}
                  title="Toggle Language / Zmień język"
                >
                  <Languages size={14} />
                  {language.toUpperCase()}
                </button>

                {themeMode && (
                  <button
                    onClick={toggleTheme}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300 focus:outline-none",
                      isDarkTheme
                        ? "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/40 text-white"
                        : "border border-slate-200 bg-white/90 hover:bg-slate-100 hover:border-slate-300 text-slate-900",
                    )}
                    title="Toggle Theme"
                  >
                    {isDarkTheme ? <Sun size={15} /> : <Moon size={15} />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
