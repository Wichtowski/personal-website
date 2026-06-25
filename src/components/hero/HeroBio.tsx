"use client";

import React from "react";

interface HeroBioProps {
  bio: string;
}

export function HeroBio({ bio }: HeroBioProps) {
  return (
    <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
      {bio}
    </p>
  );
}
