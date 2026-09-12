"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Hero } from "./hero/Hero";
import { TechStackShowcase } from "./TechStackShowcase";
import { Footer } from "@components/layout/Footer";
import type { LastFmNowPlaying } from "@lib/lastfm";

const DeferredSpotifyNowPlaying = lazy(() =>
  import("./hero/SpotifyNowPlaying").then(({ SpotifyNowPlaying }) => ({
    default: SpotifyNowPlaying,
  })),
);

interface LandingPageProps {
  nowPlaying?: LastFmNowPlaying;
}

export function LandingPage({ nowPlaying }: LandingPageProps) {
  const deferredContentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadDeferredContent, setShouldLoadDeferredContent] = useState(false);

  useEffect(() => {
    const deferredContent = deferredContentRef.current;
    if (!deferredContent) return;
    const scrollContainer = deferredContent.closest("#main-content");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadDeferredContent(true);
          observer.disconnect();
        }
      },
      {
        root: scrollContainer,
        rootMargin: "400px 0px",
      },
    );

    observer.observe(deferredContent);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="w-screen h-full overflow-y-auto no-scrollbar flex flex-col justify-start relative overflow-hidden pt-12 pb-4 md:pt-32"
    >
      <div className="max-w-6xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center space-y-8">
        <Hero />

        <div className="w-full pt-4">
          <TechStackShowcase />
        </div>

        <div ref={deferredContentRef} className="w-full min-h-24 pt-4">
          {shouldLoadDeferredContent ? (
            <Suspense fallback={<div className="min-h-24" aria-hidden="true" />}>
              <DeferredSpotifyNowPlaying nowPlaying={nowPlaying} />
            </Suspense>
          ) : null}
        </div>
      </div>
      <Footer />
    </section>
  );
}
