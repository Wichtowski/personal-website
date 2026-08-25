import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  createFallbackLastFmNowPlaying,
  createLastFmNowPlayingResponse,
  getLastFmNowPlaying,
  type LastFmNowPlaying,
} from "./lastfm";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("Last.fm now-playing caching", () => {
  test("marks inactive and fallback responses as no-store at every cache layer", () => {
    const response = createLastFmNowPlayingResponse(createFallbackLastFmNowPlaying(), "MISS");

    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("CDN-Cache-Control"), "no-store");
    assert.equal(response.headers.get("Cloudflare-CDN-Cache-Control"), "no-store");
  });

  test("caches confirmed playback only at the edge", () => {
    const nowPlaying: LastFmNowPlaying = {
      isPlaying: true,
      track: "Test track",
      artist: "Test artist",
      url: "https://www.last.fm/music/test/track",
      source: "lastfm",
      updatedAt: new Date().toISOString(),
    };
    const response = createLastFmNowPlayingResponse(nowPlaying, "MISS");

    assert.equal(response.headers.get("Cache-Control"), "no-store");
    assert.equal(response.headers.get("CDN-Cache-Control"), "public, max-age=30");
    assert.equal(response.headers.get("Cloudflare-CDN-Cache-Control"), "public, max-age=30");
  });

  test("checks Last.fm again immediately after an inactive response", async () => {
    let requestCount = 0;
    const responses = [
      {
        recenttracks: {
          track: [{ name: "Previous track", artist: { "#text": "Test artist" } }],
        },
      },
      {
        recenttracks: {
          track: [
            {
              name: "Current track",
              artist: { "#text": "Test artist" },
              "@attr": { nowplaying: "true" },
            },
          ],
        },
      },
    ];

    globalThis.fetch = async () => {
      const body = responses[requestCount];
      requestCount += 1;
      return Response.json(body);
    };

    const first = await getLastFmNowPlaying({ user: "test-user", apiKey: "test-key" });
    const second = await getLastFmNowPlaying({ user: "test-user", apiKey: "test-key" });

    assert.equal(first.isPlaying, false);
    assert.equal(second.isPlaying, true);
    assert.equal(second.track, "Current track");
    assert.equal(requestCount, 2);
  });
});
