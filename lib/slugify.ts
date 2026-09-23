/** Same normalization `PageForm.tsx` does client-side for its title→slug
 * auto-fill, extracted here because the blog category/tag upsert-by-name
 * logic needs the identical transform server-side (so a category typed as
 * "Business Class" and later "business class" resolve to the same row). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
