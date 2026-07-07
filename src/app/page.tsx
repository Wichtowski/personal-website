import { createFallbackLastFmNowPlaying, getLastFmNowPlaying } from "@lib/lastfm";
import { LandingPage } from "@components/landingpage/LandingPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const nowPlaying = await getLastFmNowPlaying().catch(() => createFallbackLastFmNowPlaying());

  return <LandingPage nowPlaying={nowPlaying} />;
}
