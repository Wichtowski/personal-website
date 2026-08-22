import { createFallbackLastFmNowPlaying, getLastFmNowPlaying } from "@lib/lastfm";

export const runtime = "nodejs";

function jsonResponse(data: unknown, cacheStatus: "HIT" | "MISS" | "BYPASS", status = 200) {
  const isNowPlaying =
    typeof data === "object" && data !== null && "isPlaying" in data && data.isPlaying === true;
  const cacheControl = isNowPlaying
    ? "public, max-age=15, s-maxage=30, stale-while-revalidate=30"
    : "no-store";

  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": cacheControl,
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
