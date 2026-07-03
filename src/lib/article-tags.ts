export function normalizeContentTag(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function matchesContentTag(contentTag: string, filterTag: string) {
  return normalizeContentTag(contentTag) === normalizeContentTag(filterTag);
}

export const normalizeArticleTag = normalizeContentTag;
export const matchesArticleTag = matchesContentTag;
