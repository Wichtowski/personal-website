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

type LastFmCacheEntry = {
  data: LastFmNowPlaying;
  expiresAt: number;
};

type LastFmOptions = {
  user?: string;
  apiKey?: string;
};

const LASTFM_CACHE_TTL_MS = 180_000;
let lastFmCache: LastFmCacheEntry | null = null;

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

export async function getLastFmNowPlaying(options: LastFmOptions = {}): Promise<LastFmNowPlaying> {
  if (lastFmCache && lastFmCache.data.isPlaying && Date.now() < lastFmCache.expiresAt) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[lastfm] cache hit", {
        isPlaying: lastFmCache.data.isPlaying,
        trackName: lastFmCache.data.track,
        artist: lastFmCache.data.artist,
      });
    }

    return lastFmCache.data;
  }

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
  const nowPlaying = track?.["@attr"]?.nowplaying === "true";
  const result: LastFmNowPlaying = {
    isPlaying: nowPlaying,
    track: track?.name ?? null,
    artist: track?.artist?.["#text"] ?? null,
    url: track?.url ?? null,
    source: "lastfm",
    updatedAt: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[lastfm] response", {
      hasRecentTracks: Boolean(data.recenttracks),
      trackType: Array.isArray(recentTracks) ? "array" : typeof recentTracks,
      hasTrack: Boolean(track),
      nowPlaying,
      trackName: result.track,
      artist: result.artist,
    });
  }

  if (nowPlaying) {
    lastFmCache = {
      data: result,
      expiresAt: Date.now() + LASTFM_CACHE_TTL_MS,
    };
  } else {
    // Never retain an inactive response; the next request should re-check Last.fm.
    lastFmCache = null;
    if (process.env.NODE_ENV !== "production") {
      console.info("[lastfm] inactive response, not caching");
    }
  }

  return result;
}
