import { revalidatePath } from "next/cache";

/** Must match `services/chrome.service.ts`'s `CHROME_PAGE_SLUG` — not
 * imported from there to avoid a `lib/` → `services/` dependency running
 * against this codebase's usual layering (services depend on lib, not the
 * reverse). Just a plain string; there's nothing to keep in sync beyond
 * this literal matching that one. */
const CHROME_PAGE_SLUG = "site-chrome";

/** Invalidates a page's ISR cache the moment its content changes. Without
 * this, a save can sit behind `app/page.tsx`'s `revalidate` window — a
 * client re-render during that window can briefly see fresher data than
 * the still-cached server HTML, which is exactly what a hydration
 * mismatch looks like. Called after every page/section mutation instead
 * of waiting for the timed revalidation.
 *
 * The chrome page is special-cased: Header/Footer render on every route,
 * not just one path, so an edit there has to invalidate every route
 * instead of a single slug's path. */
export function revalidatePageBySlug(slug: string) {
  if (slug === CHROME_PAGE_SLUG) {
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/quote");
    revalidatePath("/insights");
    revalidatePath("/insights/[slug]", "page");
    revalidatePath("/[slug]", "page");
    return;
  }
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}
