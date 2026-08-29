import { revalidatePath } from "next/cache";

/** Invalidates a page's ISR cache the moment its content changes. Without
 * this, a save can sit behind `app/page.tsx`'s `revalidate` window — a
 * client re-render during that window can briefly see fresher data than
 * the still-cached server HTML, which is exactly what a hydration
 * mismatch looks like. Called after every page/section mutation instead
 * of waiting for the timed revalidation. */
export function revalidatePageBySlug(slug: string) {
  revalidatePath(slug === "home" ? "/" : `/${slug}`);
}
