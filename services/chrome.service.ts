import "server-only";
import { cache } from "react";
import { logger } from "@/lib/logger";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { FooterSectionData, HeaderSectionData } from "@/types/page-sections";

/** The one singleton `Page` row carrying site-wide chrome (Header/Footer
 * content) instead of any real page's content — see the "chrome" template
 * guards in `PageForm.tsx` and its exclusion from `listPagesForViewer`.
 * Must match the slug the one-off seed script creates it with. */
export const CHROME_PAGE_SLUG = "site-chrome";

type ChromeSections = Partial<{ HEADER: HeaderSectionData; FOOTER: FooterSectionData }>;

/**
 * Loads the site-wide chrome's DB-driven content, for spreading into
 * `Header`/`Footer`'s props (`<HeaderClient {...chrome.HEADER} />`). Every
 * prop on those components is optional with the current hardcoded content
 * as a fallback, so returning `{}` here — on a missing/unpublished chrome
 * page, a missing section, or any DB error — renders the header/footer
 * exactly as before this became DB-driven. Same "never a single point of
 * failure" reasoning as `getHomeSectionsSafely`.
 *
 * Wrapped in React's `cache()`: unlike the homepage's sections (fetched
 * once in `app/page.tsx` and spread into every section component), Header
 * and Footer are two independent Server Components with no shared parent
 * fetching this once — every page renders both, so without `cache()` this
 * would run twice per request instead of once.
 */
export const getChromeSectionsSafely = cache(async (): Promise<ChromeSections> => {
  try {
    const page = await getPageByIdOrSlugForViewer(CHROME_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<string, unknown> = {};
    for (const section of sections) {
      result[section.sectionType] = section.data ?? {};
    }
    return result as ChromeSections;
  } catch (error) {
    logger.error("Failed to load site chrome — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
});
