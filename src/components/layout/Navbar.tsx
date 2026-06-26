"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Terminal, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ROUTES, setNavDirection } from "@/lib/navigation";

const ROUTE_TO_SECTION: Record<string, string> = {
  "/": "home",
  "/github": "github",
  "/portfolio": "portfolio",
  "/articles": "articles",
  "/contact": "contact",
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  const activeSection = ROUTE_TO_SECTION[pathname] ?? "home";
  const scrolled = pathname !== "/";

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

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
    const currentIdx = ROUTES.indexOf(pathname);
    const nextIdx = ROUTES.indexOf(target);
    setNavDirection(nextIdx >= currentIdx ? -1 : 1);
    router.push(target);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 border-b",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/40 shadow-md"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => handleScrollTo("home")}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-all group-hover:bg-primary/25 group-hover:border-primary/40">
            <Terminal size={18} />
          </div>
          <span className="font-mono text-sm tracking-widest font-bold text-foreground">
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
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
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
            onClick={toggleLanguage}
            className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-primary/40 text-foreground transition-all duration-300 flex items-center gap-1.5 focus:outline-none text-xs font-mono font-medium"
            title="Toggle Language / Zmień język"
          >
            <Languages size={14} />
            {language.toUpperCase()}
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-primary/40 text-foreground transition-all duration-300 focus:outline-none"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-border/40 text-foreground hover:bg-muted/50 focus:outline-none"
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
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md overflow-hidden"
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
                        : "text-muted-foreground hover:text-foreground hover:pl-2",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-primary/40 text-foreground text-xs font-mono font-medium flex items-center gap-1.5 focus:outline-none"
                  title="Toggle Language / Zmień język"
                >
                  <Languages size={14} />
                  {language.toUpperCase()}
                </button>

                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg border border-border/40 hover:bg-muted/50 hover:border-primary/40 text-foreground transition-all duration-300 focus:outline-none"
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
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
