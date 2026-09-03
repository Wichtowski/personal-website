import { buildGitHubContributions } from "@lib/github-contributions";

export const runtime = "nodejs";

const CACHE_SECONDS = 60 * 30; // 30 min
const STALE_SECONDS = 60 * 60 * 24; // 24h

function jsonResponse(data: unknown, cacheStatus: "HIT" | "MISS" | "BYPASS", status = 200) {
  const cacheControl =
    cacheStatus === "BYPASS"
      ? "no-store"
      : `public, max-age=60, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`;

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
    const data = await buildGitHubContributions();
    return jsonResponse(data, data.partial ? "BYPASS" : "MISS");
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error: "Could not load GitHub contributions",
        generatedAt: new Date().toISOString(),
      },
      "BYPASS",
      502,
    );
  }
}
