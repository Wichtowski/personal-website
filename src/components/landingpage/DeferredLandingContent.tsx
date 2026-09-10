"use client";

import { SpotifyNowPlaying } from "./hero/SpotifyNowPlaying";
import { TechStackShowcase } from "./TechStackShowcase";
import type { LastFmNowPlaying } from "@lib/lastfm";

export default function DeferredLandingContent({ nowPlaying }: { nowPlaying?: LastFmNowPlaying }) {
  return (
    <div className="flex w-full flex-col gap-12">
      <TechStackShowcase />
      <SpotifyNowPlaying nowPlaying={nowPlaying} />
    </div>
  );
}
