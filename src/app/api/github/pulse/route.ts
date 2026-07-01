import { buildGitHubPulse } from "@lib/github-pulse";

export const runtime = "nodejs";

const CACHE_SECONDS = 60 * 30; // 30 min
const STALE_SECONDS = 60 * 60 * 24; // 24h

function jsonResponse(data: unknown, cacheStatus: "HIT" | "MISS" | "BYPASS", status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": `public, max-age=60, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "CDN-Cache-Control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Cache": cacheStatus,
    },
  });
}

export async function GET() {
  try {
    const data = await buildGitHubPulse();
    return jsonResponse(data, "MISS");
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: "Could not load GitHub pulse",
        generatedAt: new Date().toISOString(),
      },
      "BYPASS",
      502,
    );
  }
}
