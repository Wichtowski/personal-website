"use client";

import React from "react";

interface HeroTitleProps {
  greeting: string;
  role: string;
}

export function HeroTitle({ greeting, role }: HeroTitleProps) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-mono text-primary font-bold block tracking-wider uppercase">
        {greeting}
      </span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-mono">
        Oskar <span className="text-primary">Wichtowski</span>
      </h1>
      <p className="text-sm font-mono text-muted-foreground font-medium pt-1">&lt; {role} /&gt;</p>
    </div>
  );
}
