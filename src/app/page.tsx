import { createFallbackLastFmNowPlaying, getLastFmNowPlaying } from "@/lib/lastfm";
import { Hero } from "@/components/landingpage/hero/Hero";

export const dynamic = "force-dynamic";

export default async function Home() {
  const nowPlaying = await getLastFmNowPlaying().catch(() => createFallbackLastFmNowPlaying());

  return <Hero nowPlaying={nowPlaying} />;
}
