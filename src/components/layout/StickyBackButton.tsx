"use client";

import React, { useEffect, useState } from "react";
import Link, { LinkProps } from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StickyBackButtonProps {
  href: LinkProps["href"];
  label: string;
}

export function StickyBackButton({ href, label }: StickyBackButtonProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mb-12 h-6 flex items-center relative">
      <AnimatePresence mode="popLayout">
        {!isScrolled ? (
          <Link
            key="inline"
            href={href}
            className="inline-flex items-center gap-2 text-sm font-mono font-bold text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          >
            <motion.div
              layoutId="back-btn-container"
              className="flex items-center gap-2"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              <motion.span layoutId="back-btn-arrow" className="flex items-center">
                <ArrowLeft size={16} />
              </motion.span>
              <motion.span layoutId="back-btn-text" className="inline-block">
                {label}
              </motion.span>
            </motion.div>
          </Link>
        ) : (
          <Link
            key="sticky"
            href={href}
            className="fixed top-28 left-4 md:left-8 xl:left-12 z-40 inline-flex items-center gap-2 text-xs font-mono font-bold text-foreground bg-background/80 hover:bg-background border border-border/40 hover:border-primary/50 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md transition-all focus:outline-none"
          >
            <motion.div
              layoutId="back-btn-container"
              className="flex items-center gap-2"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
            >
              <motion.span layoutId="back-btn-arrow" className="flex items-center">
                <ArrowLeft size={14} />
              </motion.span>
              <motion.span layoutId="back-btn-text" className="inline-block">
                {label}
              </motion.span>
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
