import "server-only";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const MISSED_FLIGHT_ASSISTANCE_PAGE_SLUG = "missed-flight-assistance";

type MissedFlightAssistanceSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the Missed Flight Assistance page's DB-driven section content,
 * keyed by section type, for spreading straight into each component's
 * props (`<CancellationHero {...sections.MF_HERO} />`). Every component's
 * props are optional with the current hardcoded copy as a fallback (see
 * `Hero.tsx`'s pattern), so returning `{}` here — on a missing/unpublished
 * page, a missing section, or any DB error — makes the page render exactly
 * as it did before this became DB-driven. Mirrors
 * `getInternationalFlightBookingSectionsSafely` exactly (see
 * `services/international-flight-booking.service.ts`).
 */
export async function getMissedFlightAssistanceSectionsSafely(): Promise<MissedFlightAssistanceSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(MISSED_FLIGHT_ASSISTANCE_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as MissedFlightAssistanceSections;
  } catch (error) {
    // A missing `Page` row (this template hasn't been created in the admin
    // yet) is expected, not a failure — logged at `warn` so it doesn't trip
    // Next.js dev's `console.error`-triggered red overlay. Anything else
    // (a real DB error, etc.) stays at `error`.
    const log = error instanceof NotFoundError ? logger.warn : logger.error;
    log("Failed to load Missed Flight Assistance page sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The Missed Flight Assistance page's `Page` id, for `generateMetadata`
 * to look up its `SeoMetadata` row — returns `null` under the same "never
 * break the page" fallback as `getMissedFlightAssistanceSectionsSafely`. */
export async function getMissedFlightAssistancePageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(MISSED_FLIGHT_ASSISTANCE_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
