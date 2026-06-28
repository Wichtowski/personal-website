"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import type { LastFmNowPlaying } from "@/lib/lastfm";
import { CatsModal } from "./CatsModal";

interface HeroSpotifyNowPlayingProps {
  nowPlaying?: LastFmNowPlaying;
}

export function HeroSpotifyNowPlaying({ nowPlaying }: HeroSpotifyNowPlayingProps) {
  const { t } = useLanguage();
  const [isCatsModalOpen, setIsCatsModalOpen] = React.useState(false);
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
  const title = isLive
    ? `${t.hero.listeningTo} ${safeNowPlaying.track}`
    : `${t.hero.listeningTo} ${t.hero.idleTrack}`;
  const subtitle = isLive ? (safeNowPlaying.artist ?? t.hero.lastFmLabel) : t.hero.idleArtist;

  const cardClassName = isLive
    ? "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-400/35 bg-emerald-400/12 px-5 py-4 text-sm text-emerald-950 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md dark:text-emerald-50"
    : "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-900 shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_10px_30px_rgba(16,185,129,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/45 hover:bg-emerald-400/14 hover:text-emerald-950 dark:text-emerald-50";

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {isLive ? (
        <motion.a
          href="https://open.spotify.com/user/11144475049"
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="shrink-0 text-emerald-600 dark:text-emerald-100"
          >
            <FaSpotify size={30} />
          </motion.span>

          <span className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="truncate font-mono text-base font-semibold sm:text-lg">{title}</span>
            {subtitle ? (
              <span className="truncate font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-700/80 dark:text-emerald-200/80">
                {subtitle}
              </span>
            ) : null}
          </span>
        </motion.a>
      ) : (
        <motion.button
          type="button"
          onClick={() => setIsCatsModalOpen(true)}
          className={cardClassName}
          aria-haspopup="dialog"
          aria-expanded={isCatsModalOpen}
        >
          <motion.span className="shrink-0 text-emerald-700 transition-colors duration-300 group-hover:text-emerald-600 dark:text-emerald-200">
            <FaSpotify size={24} />
          </motion.span>

          <span className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="truncate font-mono text-xs text-emerald-950 sm:text-sm dark:text-emerald-50">
              {title}
            </span>
            {subtitle ? (
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-700/75 dark:text-emerald-200/75">
                {subtitle}
              </span>
            ) : null}
          </span>
        </motion.button>
      )}

      <CatsModal open={isCatsModalOpen} onClose={() => setIsCatsModalOpen(false)} />
    </div>
  );
}
