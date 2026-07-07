"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useLanguage } from "@context/LanguageContext";
import type { LastFmNowPlaying, SpotifyNowPlayingProps } from "@lib/lastfm";
import { CatsModal } from "./CatsModal";

const LASTFM_REFRESH_INTERVAL_MS = 30_000;

function createIdleNowPlaying(): LastFmNowPlaying {
  return {
    isPlaying: false,
    track: null,
    artist: null,
    url: null,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  };
}

function isLastFmNowPlaying(value: unknown): value is LastFmNowPlaying {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Partial<LastFmNowPlaying>;

  return (
    typeof data.isPlaying === "boolean" &&
    (typeof data.track === "string" || data.track === null) &&
    (typeof data.artist === "string" || data.artist === null) &&
    (typeof data.url === "string" || data.url === null) &&
    (data.source === "lastfm" || data.source === "fallback") &&
    typeof data.updatedAt === "string"
  );
}

export function SpotifyNowPlaying({ nowPlaying }: SpotifyNowPlayingProps) {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [isCatsModalOpen, setIsCatsModalOpen] = React.useState(false);
  const [currentNowPlaying, setCurrentNowPlaying] = React.useState<LastFmNowPlaying>(
    nowPlaying ?? createIdleNowPlaying(),
  );

  React.useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;
    let controller: AbortController | undefined;

    const refreshNowPlaying = async () => {
      controller?.abort();
      controller = new AbortController();

      try {
        const response = await fetch("/api/lastfm/now-playing", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch Last.fm now playing: ${response.status}`);
        }

        const data: unknown = await response.json();

        if (active && isLastFmNowPlaying(data)) {
          setCurrentNowPlaying(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error(error);
      } finally {
        if (active) {
          timeoutId = window.setTimeout(refreshNowPlaying, LASTFM_REFRESH_INTERVAL_MS);
        }
      }
    };

    timeoutId = window.setTimeout(refreshNowPlaying, 0);

    return () => {
      active = false;
      controller?.abort();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const safeNowPlaying = currentNowPlaying;

  const hasTrack = Boolean(safeNowPlaying.track);
  const isLive = safeNowPlaying.isPlaying && hasTrack;
  const title = isLive
    ? `${t.hero.listeningTo} ${safeNowPlaying.track}`
    : `${t.hero.listeningTo} ${t.hero.idleTrack}`;
  const subtitle = isLive ? (safeNowPlaying.artist ?? t.hero.lastFmLabel) : t.hero.idleArtist;
  const isDarkTheme = resolvedTheme === "dark";

  const cardClassName = isDarkTheme
    ? isLive
      ? "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-400/35 bg-emerald-400/12 px-5 py-4 text-sm text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_10px_30px_rgba(16,185,129,0.12)] backdrop-blur-md"
      : "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-50 shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_10px_30px_rgba(16,185,129,0.10)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/45 hover:bg-emerald-400/14"
    : isLive
      ? "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-500/35 bg-[#f7fffb] px-5 py-4 text-sm text-zinc-950 shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_14px_34px_rgba(24,24,27,0.10)] backdrop-blur-md"
      : "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border border-emerald-500/35 bg-[#f7fffb] px-5 py-4 text-sm text-zinc-950 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_14px_34px_rgba(24,24,27,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-600/45 hover:bg-emerald-50";
  const iconClassName = isDarkTheme ? "shrink-0 text-emerald-100" : "shrink-0 text-emerald-700";
  const subtitleClassName = isDarkTheme ? "text-emerald-200/80" : "text-emerald-800/80";

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
            className={iconClassName}
          >
            <FaSpotify size={30} />
          </motion.span>

          <span className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="truncate font-mono text-base font-semibold sm:text-lg">{title}</span>
            {subtitle ? (
              <span
                className={`truncate font-mono text-[11px] uppercase tracking-[0.24em] ${subtitleClassName}`}
              >
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
          <motion.span className={iconClassName}>
            <FaSpotify size={24} />
          </motion.span>

          <span className="flex min-w-0 flex-col items-start gap-0.5">
            <span className="truncate font-mono text-xs sm:text-sm">{title}</span>
            {subtitle ? (
              <span
                className={`truncate font-mono text-[10px] uppercase tracking-[0.2em] ${subtitleClassName}`}
              >
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
