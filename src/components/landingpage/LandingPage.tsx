"use client";

import React, { useState, useEffect } from "react";
import { Hero } from "./hero/Hero";
import { SpotifyNowPlaying } from "./hero/SpotifyNowPlaying";
import { TechStackShowcase } from "./TechStackShowcase";
import { Footer } from "@components/layout/Footer";
import type { LastFmNowPlaying } from "@lib/lastfm";

interface LandingPageProps {
  nowPlaying?: LastFmNowPlaying;
}

export function LandingPage({ nowPlaying }: LandingPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  return (
    <section
      id="home"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col justify-start relative overflow-hidden pt-12 pb-4 md:pt-32"
    >
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center space-y-8">
        <Hero />

        {/* Social links and a calmer stack preview */}
        <div className="w-full flex flex-col gap-12 pt-4">
          <TechStackShowcase />
          <SpotifyNowPlaying nowPlaying={nowPlaying} />
        </div>
      </div>
      <Footer />
    </section>
  );
}
