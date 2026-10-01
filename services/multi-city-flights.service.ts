import "server-only";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const MULTI_CITY_FLIGHTS_PAGE_SLUG = "multi-city-flights";

type MultiCityFlightsSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the Multi-City Flights page's DB-driven section content, keyed by
 * section type, for spreading straight into each component's props
 * (`<MultiCityHero {...sections.MC_HERO} />`). Every component's props are
 * optional with the current hardcoded copy as a fallback (see `Hero.tsx`'s
 * pattern), so returning `{}` here — on a missing/unpublished page, a
 * missing section, or any DB error — makes the page render exactly as it
 * did before this became DB-driven. Mirrors `getBusinessClassSectionsSafely`
 * exactly (see `services/business-class.service.ts`).
 */
export async function getMultiCityFlightsSectionsSafely(): Promise<MultiCityFlightsSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(MULTI_CITY_FLIGHTS_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as MultiCityFlightsSections;
  } catch (error) {
    logger.error("Failed to load Multi-City Flights page sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The Multi-City Flights page's `Page` id, for `generateMetadata` to look
 * up its `SeoMetadata` row — returns `null` under the same "never break the
 * page" fallback as `getMultiCityFlightsSectionsSafely`. */
export async function getMultiCityFlightsPageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(MULTI_CITY_FLIGHTS_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
