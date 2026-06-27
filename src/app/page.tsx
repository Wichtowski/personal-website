import { createFallbackLastFmNowPlaying, getLastFmNowPlaying } from "@/lib/lastfm";
import { Hero } from "@/components/landingpage/hero/Hero";

export default async function Home() {
  const nowPlaying = await getLastFmNowPlaying().catch(() => createFallbackLastFmNowPlaying());

  return <Hero nowPlaying={nowPlaying} />;
}
