import "server-only";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const HOME_PAGE_SLUG = "home";

type HomeSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the homepage's DB-driven section content, keyed by section type,
 * for spreading straight into each component's props
 * (`<Hero {...sections.HERO} />`). Every homepage component's props are
 * optional with the current hardcoded copy as a fallback (see `Hero.tsx`),
 * so returning `{}` here — on a missing/unpublished page, a missing
 * section, or any DB error — makes the homepage render exactly as it did
 * before this became DB-driven. The database is a progressive
 * enhancement, never a single point of failure for the site's front door.
 */
export async function getHomeSectionsSafely(): Promise<HomeSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(HOME_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    // TypeScript can't narrow a generic mapped-type index assignment like
    // `result[type] = value` to the specific member type for that key (a
    // known limitation, not a real type hole) — the cast through
    // `Record<SectionType, unknown>` sidesteps it; `section.data`'s actual
    // shape is trusted to match its `sectionType`, same as every other
    // consumer of this freeform JSON column.
    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as HomeSections;
  } catch (error) {
    logger.error("Failed to load homepage sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The homepage's `Page` id, for `generateMetadata` to look up its
 * `SeoMetadata` row — returns `null` under the same "never break the
 * homepage" fallback as `getHomeSectionsSafely`. */
export async function getHomePageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(HOME_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
