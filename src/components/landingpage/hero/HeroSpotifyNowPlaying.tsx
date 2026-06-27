"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import type { LastFmNowPlaying } from "@/lib/lastfm";

interface HeroSpotifyNowPlayingProps {
  nowPlaying?: LastFmNowPlaying;
}

export function HeroSpotifyNowPlaying({ nowPlaying }: HeroSpotifyNowPlayingProps) {
  const { t } = useLanguage();
  const safeNowPlaying: LastFmNowPlaying = nowPlaying ?? {
    isPlaying: false,
    track: null,
    artist: null,
    url: null,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  };

  const hasTrack = Boolean(safeNowPlaying.track);
  const isLive = safeNowPlaying.isPlaying && hasTrack;
  const title = hasTrack
    ? isLive
      ? `${t.hero.listeningTo} ${safeNowPlaying.track}`
      : `${t.hero.lastPlayed} ${safeNowPlaying.track}`
    : `${t.hero.listeningTo} ${t.hero.idleTrack}`;
  const subtitle = hasTrack ? (safeNowPlaying.artist ?? t.hero.lastFmLabel) : t.hero.idleArtist;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <motion.a
        href="https://open.spotify.com/user/11144475049"
        target="_blank"
        rel="noopener noreferrer"
        className={
          isLive
            ? "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-400/35 bg-emerald-400/12 px-5 py-4 text-sm text-emerald-950 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md dark:text-emerald-50"
            : "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-border/40 bg-background/80 px-5 py-4 text-sm text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-muted/60 hover:text-foreground"
        }
      >
        <motion.span
          animate={isLive ? { rotate: 360 } : undefined}
          transition={
            isLive
              ? {
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }
              : undefined
          }
          className={
            isLive
              ? "shrink-0 text-emerald-600 dark:text-emerald-100"
              : "shrink-0 text-foreground transition-colors duration-300 group-hover:text-primary"
          }
        >
          <FaSpotify size={isLive ? 30 : 24} />
        </motion.span>

        <span className="flex min-w-0 flex-col items-start gap-0.5">
          <span
            className={
              isLive
                ? "truncate font-mono text-base sm:text-lg font-semibold"
                : "truncate font-mono text-xs sm:text-sm"
            }
          >
            {title}
          </span>
          {subtitle ? (
            <span
              className={
                isLive
                  ? "truncate font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-700/80 dark:text-emerald-200/80"
                  : "truncate font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70"
              }
            >
              {subtitle}
            </span>
          ) : null}
        </span>
      </motion.a>
    </div>
  );
}
