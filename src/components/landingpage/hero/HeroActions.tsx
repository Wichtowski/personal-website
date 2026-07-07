"use client";

import { ArrowRight } from "lucide-react";

interface HeroActionsProps {
  ctaPrimary: string;
  ctaSecondary: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function HeroActions({
  ctaPrimary,
  ctaSecondary,
  onPrimaryClick,
  onSecondaryClick,
}: HeroActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center">
      <button
        onClick={onPrimaryClick}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-mono text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none"
      >
        {ctaPrimary}
        <ArrowRight size={16} />
      </button>

      <button
        onClick={onSecondaryClick}
        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground font-mono text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none"
      >
        {ctaSecondary}
      </button>
    </div>
  );
}
