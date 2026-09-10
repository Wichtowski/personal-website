"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Hero } from "./hero/Hero";
import { Footer } from "@components/layout/Footer";
import type { LastFmNowPlaying } from "@lib/lastfm";

const DeferredLandingContent = lazy(() => import("./DeferredLandingContent"));

interface LandingPageProps {
  nowPlaying?: LastFmNowPlaying;
}

export function LandingPage({ nowPlaying }: LandingPageProps) {
  const deferredContentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadDeferredContent, setShouldLoadDeferredContent] = useState(false);

  useEffect(() => {
    const deferredContent = deferredContentRef.current;
    if (!deferredContent) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadDeferredContent(true);
          observer.disconnect();
        }
      },
      {
        root: document.getElementById("main-content"),
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
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 w-full text-center flex flex-col items-center justify-center space-y-8">
        <Hero />

        {/* Social links and a calmer stack preview */}
        <div ref={deferredContentRef} className="w-full min-h-[48rem] pt-4">
          {shouldLoadDeferredContent ? (
            <Suspense fallback={<div className="min-h-[48rem]" aria-hidden="true" />}>
              <DeferredLandingContent nowPlaying={nowPlaying} />
            </Suspense>
          ) : null}
        </div>
      </div>
      <Footer />
    </section>
  );
}
