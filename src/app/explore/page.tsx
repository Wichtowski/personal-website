import { ExploreSection } from "@components/explore/ExploreSection";
import { getArticles, getProjects } from "@lib/mdx";

function readTags(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return values.flatMap((item) =>
    item
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[]; tags?: string | string[] }>;
}) {
  const { tag, tags } = await searchParams;

  return (
    <ExploreSection
      projects={getProjects()}
      articles={getArticles()}
      activeTags={[...readTags(tag), ...readTags(tags)]}
    />
  );
}
