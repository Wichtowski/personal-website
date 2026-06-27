import { createFallbackLastFmNowPlaying, getLastFmNowPlaying } from "@/lib/lastfm";

export const runtime = "nodejs";

const CACHE_SECONDS = 60;
const STALE_SECONDS = 60 * 10;

function jsonResponse(data: unknown, cacheStatus: "HIT" | "MISS" | "BYPASS", status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": `public, max-age=30, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "CDN-Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Cache": cacheStatus,
    },
  });
}

export async function GET() {
  try {
    const data = await getLastFmNowPlaying();
    return jsonResponse(data, "MISS");
  } catch (error) {
    console.error(error);

    return jsonResponse(createFallbackLastFmNowPlaying(), "BYPASS", 502);
  }
}
