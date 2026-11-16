import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { listPublishedBlogPosts } from "@/repositories/blog-post.repository";

export const dynamic = "force-dynamic";

/** Same base-URL pattern as `app/insights/[slug]/page.tsx` and
 * `lib/mail.ts` — no shared helper exists yet, so this repeats it. */
function siteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path}`;
}

/** Every hardcoded (non-CMS) route under `app/` — these aren't `Page` rows
 * in the database, so they can't be discovered by querying it. Keep this
 * in sync with `app/`'s top-level folders. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/business-class", priority: 0.8 },
  { path: "/business-partnerships", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/date-change-assistance", priority: 0.6 },
  { path: "/first-class", priority: 0.8 },
  { path: "/flight-cancellation", priority: 0.6 },
  { path: "/flight-change", priority: 0.6 },
  { path: "/insights", priority: 0.7 },
  { path: "/international-flight-booking", priority: 0.6 },
  { path: "/last-minute-flights", priority: 0.6 },
  { path: "/missed-flight-assistance", priority: 0.6 },
  { path: "/multi-city-flights", priority: 0.8 },
  { path: "/name-correction", priority: 0.6 },
  { path: "/one-way-flights", priority: 0.6 },
  { path: "/quote", priority: 0.9 },
  { path: "/schedule-changes", priority: 0.6 },
  { path: "/why-choose-us", priority: 0.6 },
];

/** Lists every published page and blog post so search engines can discover
 * them — never breaks the route on a DB error, same "never break the page"
 * fallback every `get*Safely` function in this codebase uses, since a
 * sitemap that 500s is worse than one that's briefly missing new content. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: siteUrl(path),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
  }));

  try {
    const [policyPages, blogPosts] = await Promise.all([
      prisma.page.findMany({
        where: { status: "PUBLISHED", template: "policy" },
        select: { slug: true, updatedAt: true },
      }),
      listPublishedBlogPosts(),
    ]);

    const policyEntries: MetadataRoute.Sitemap = policyPages.map((page) => ({
      url: siteUrl(`/${page.slug}`),
      lastModified: page.updatedAt,
      changeFrequency: "yearly",
      priority: 0.3,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: siteUrl(`/insights/${post.slug}`),
      lastModified: post.updatedAt ?? post.publishedAt ?? new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    return [...staticEntries, ...policyEntries, ...blogEntries];
  } catch (error) {
    logger.error("Failed to load pages/blog posts for sitemap — serving static routes only", {
      error: error instanceof Error ? error.message : String(error),
    });
    return staticEntries;
  }
}
