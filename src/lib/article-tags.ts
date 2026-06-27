export function normalizeArticleTag(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchesArticleTag(articleTag: string, filterTag: string) {
  return normalizeArticleTag(articleTag) === normalizeArticleTag(filterTag);
}
