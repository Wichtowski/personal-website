import { env } from "@lib/env";

export interface LastFmNowPlaying {
  isPlaying: boolean;
  track: string | null;
  artist: string | null;
  url: string | null;
  source: "lastfm" | "fallback";
  updatedAt: string;
}

export interface SpotifyNowPlayingProps {
  nowPlaying?: LastFmNowPlaying;
}

type LastFmRecentTracksResponse = {
  recenttracks?: {
    track?: LastFmTrack[] | LastFmTrack;
  };
};

type LastFmTrack = {
  name?: string;
  artist?: { "#text"?: string };
  url?: string;
  "@attr"?: { nowplaying?: "true" };
};

type LastFmOptions = {
  user?: string;
  apiKey?: string;
};

type LastFmCacheStatus = "MISS" | "BYPASS";

const LASTFM_EDGE_CACHE_CONTROL = "public, max-age=30";
const LASTFM_NO_STORE = "no-store";

export function createFallbackLastFmNowPlaying(): LastFmNowPlaying {
  return {
    isPlaying: false,
    track: null,
    artist: null,
    url: null,
    source: "fallback",
    updatedAt: new Date().toISOString(),
  };
}

const pickCurrentTrack = (tracks: LastFmTrack[] | LastFmTrack | undefined) => {
  if (!tracks) {
    return null;
  }

  return Array.isArray(tracks) ? (tracks[0] ?? null) : tracks;
};

export function createLastFmNowPlayingResponse(
  data: LastFmNowPlaying,
  cacheStatus: LastFmCacheStatus,
  status = 200,
) {
  const edgeCacheControl =
    data.isPlaying && data.track ? LASTFM_EDGE_CACHE_CONTROL : LASTFM_NO_STORE;

  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": LASTFM_NO_STORE,
      "CDN-Cache-Control": edgeCacheControl,
      "Cloudflare-CDN-Cache-Control": edgeCacheControl,
      "Content-Type": "application/json; charset=utf-8",
      "X-Cache": cacheStatus,
    },
  });
}

export async function getLastFmNowPlaying(options: LastFmOptions = {}): Promise<LastFmNowPlaying> {
  const user = options.user ?? env.LASTFM_USERNAME;
  const apiKey = options.apiKey ?? env.LASTFM_API_KEY;

  if (!user || !apiKey) {
    return createFallbackLastFmNowPlaying();
  }

  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user,
    api_key: apiKey,
    format: "json",
    limit: "1",
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Last.fm API failed: ${response.status}`);
  }

  const data = (await response.json()) as LastFmRecentTracksResponse;
  const recentTracks = data.recenttracks?.track;
  const track = pickCurrentTrack(recentTracks);
  const isPlaying = track?.["@attr"]?.nowplaying === "true" && Boolean(track.name);

  return {
    isPlaying,
    track: track?.name ?? null,
    artist: track?.artist?.["#text"] ?? null,
    url: track?.url ?? null,
    source: "lastfm",
    updatedAt: new Date().toISOString(),
  };
}
