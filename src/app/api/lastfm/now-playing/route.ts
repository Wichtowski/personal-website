import {
  createFallbackLastFmNowPlaying,
  createLastFmNowPlayingResponse,
  getLastFmNowPlaying,
} from "@lib/lastfm";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getLastFmNowPlaying();
    return createLastFmNowPlayingResponse(data, "MISS");
  } catch (error) {
    console.error(error);

    return createLastFmNowPlayingResponse(createFallbackLastFmNowPlaying(), "BYPASS", 502);
  }
}
