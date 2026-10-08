import "server-only";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const NAME_CORRECTION_PAGE_SLUG = "name-correction";

type NameCorrectionSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the Flight Name Correction Assistance page's DB-driven section
 * content, keyed by section type, for spreading straight into each
 * component's props (`<MultiCityHero {...sections.NC_HERO} />`). Every
 * component's props are optional with the current hardcoded copy as a
 * fallback (see `Hero.tsx`'s pattern), so returning `{}` here — on a
 * missing/unpublished page, a missing section, or any DB error — makes
 * the page render exactly as it did before this became DB-driven. Mirrors
 * `getScheduleChangesSectionsSafely` exactly (see
 * `services/schedule-changes.service.ts`).
 */
export async function getNameCorrectionSectionsSafely(): Promise<NameCorrectionSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(NAME_CORRECTION_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as NameCorrectionSections;
  } catch (error) {
    // A missing `Page` row (this template hasn't been created in the admin
    // yet) is expected, not a failure — logged at `warn` so it doesn't trip
    // Next.js dev's `console.error`-triggered red overlay. Anything else
    // (a real DB error, etc.) stays at `error`.
    const log = error instanceof NotFoundError ? logger.warn : logger.error;
    log("Failed to load Flight Name Correction page sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The Flight Name Correction Assistance page's `Page` id, for
 * `generateMetadata` to look up its `SeoMetadata` row — returns `null`
 * under the same "never break the page" fallback as
 * `getNameCorrectionSectionsSafely`. */
export async function getNameCorrectionPageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(NAME_CORRECTION_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
