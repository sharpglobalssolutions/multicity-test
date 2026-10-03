import "server-only";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const FIRST_CLASS_PAGE_SLUG = "first-class";

type FirstClassSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the First Class page's DB-driven section content, keyed by section
 * type, for spreading straight into each component's props
 * (`<MultiCityHero {...sections.FC_HERO} />`). Every component's props are
 * optional with the current hardcoded copy as a fallback (see `Hero.tsx`'s
 * pattern), so returning `{}` here — on a missing/unpublished page, a
 * missing section, or any DB error — makes the page render exactly as it
 * did before this became DB-driven. Mirrors `getMultiCityFlightsSectionsSafely`
 * exactly (see `services/multi-city-flights.service.ts`).
 */
export async function getFirstClassSectionsSafely(): Promise<FirstClassSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(FIRST_CLASS_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as FirstClassSections;
  } catch (error) {
    logger.error("Failed to load First Class page sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The First Class page's `Page` id, for `generateMetadata` to look up its
 * `SeoMetadata` row — returns `null` under the same "never break the page"
 * fallback as `getFirstClassSectionsSafely`. */
export async function getFirstClassPageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(FIRST_CLASS_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
