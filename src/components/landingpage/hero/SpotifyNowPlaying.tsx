"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import { useLanguage } from "@context/LanguageContext";
import { useThemeMode } from "@hooks/useThemeMode";
import type { LastFmNowPlaying, SpotifyNowPlayingProps } from "@lib/lastfm";
import { cn } from "@lib/cn";
import { CatsModal } from "./CatsModal";

const LASTFM_REFRESH_INTERVAL_MS = 30_000;

function createFallbackNowPlaying(): LastFmNowPlaying {
  return {
    isPlaying: false,
    track: null,
    artist: null,
    url: null,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  };
}

function isNowPlaying(value: unknown): value is LastFmNowPlaying {
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

function hasCurrentTrack(nowPlaying: LastFmNowPlaying): boolean {
  return nowPlaying.isPlaying && Boolean(nowPlaying.track);
}

export function SpotifyNowPlaying({ nowPlaying }: SpotifyNowPlayingProps) {
  const { t } = useLanguage();
  const themeMode = useThemeMode("dark");
  const [isCatsModalOpen, setIsCatsModalOpen] = useState(false);
  const [currentNowPlaying, setCurrentNowPlaying] = useState<LastFmNowPlaying>(
    nowPlaying && hasCurrentTrack(nowPlaying) ? nowPlaying : createFallbackNowPlaying(),
  );

  useEffect(() => {
    let active = true;
    let timeoutId: number | undefined;
    let controller: AbortController | undefined;

    const refreshNowPlaying = async () => {
      controller = new AbortController();

      try {
        const response = await fetch("/api/lastfm/now-playing", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data: unknown = await response.json();

        if (!active) {
          return;
        }

        if (response.ok && isNowPlaying(data) && hasCurrentTrack(data)) {
          setCurrentNowPlaying(data);
          return;
        }

        setCurrentNowPlaying(createFallbackNowPlaying());
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        // The cats fallback is intentionally shown when Last.fm cannot confirm playback
        if (active) {
          setCurrentNowPlaying(createFallbackNowPlaying());
        }
      } finally {
        if (active) {
          timeoutId = window.setTimeout(refreshNowPlaying, LASTFM_REFRESH_INTERVAL_MS);
        }
      }
    };

    void refreshNowPlaying();

    return () => {
      active = false;
      controller?.abort();

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  const isPlaying = hasCurrentTrack(currentNowPlaying);
  const title = isPlaying
    ? `${t.hero.listeningTo} ${currentNowPlaying.track}`
    : `${t.hero.listeningTo} ${t.hero.idleTrack}`;
  const subtitle = isPlaying ? currentNowPlaying.artist : t.hero.idleArtist;
  const isDarkTheme = themeMode === "dark";
  const cardClassName = cn(
    "group inline-flex min-w-[18rem] items-center gap-4 rounded-2xl border px-5 py-4 text-left shadow-[0_14px_34px_rgba(24,24,27,0.10)] transition-transform duration-200 hover:-translate-y-0.5",
    isDarkTheme
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-50 shadow-[0_14px_34px_rgba(0,0,0,0.35)]"
      : "border-emerald-500/35 bg-[#f7fffb] text-zinc-950",
  );
  const content = (
    <>
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className={isDarkTheme ? "shrink-0 text-emerald-100" : "shrink-0 text-emerald-700"}
      >
        <FaSpotify size={36} aria-hidden="true" />
      </motion.span>
      <span className="flex min-w-0 flex-col items-start gap-0.5">
        <span className="truncate font-mono text-sm font-semibold sm:text-base">{title}</span>
        <span
          className={cn(
            "truncate font-mono text-[11px] uppercase tracking-[0.2em]",
            isDarkTheme ? "text-emerald-200/80" : "text-emerald-800/80",
          )}
        >
          {subtitle}
        </span>
      </span>
    </>
  );

  return (
    <div className="w-full flex flex-col items-center gap-4 mb-4">
      {isPlaying ? (
        currentNowPlaying.url ? (
          <a
            href={currentNowPlaying.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cardClassName}
          >
            {content}
          </a>
        ) : (
          <div className={cardClassName}>{content}</div>
        )
      ) : (
        <button
          type="button"
          onClick={() => setIsCatsModalOpen(true)}
          className={cardClassName}
          aria-haspopup="dialog"
          aria-expanded={isCatsModalOpen}
        >
          {content}
        </button>
      )}

      <CatsModal open={isCatsModalOpen} onClose={() => setIsCatsModalOpen(false)} />
    </div>
  );
}
