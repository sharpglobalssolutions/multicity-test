import "server-only";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { findByEntity } from "@/repositories/seo-metadata.repository";
import { listActiveSectionsForPage } from "@/services/page-section.service";
import { getPageByIdOrSlugForViewer } from "@/services/page.service";
import type { SectionDataByType, SectionType } from "@/types/page-sections";

export const CONTACT_PAGE_SLUG = "contact";

type ContactSections = Partial<{ [K in SectionType]: SectionDataByType[K] }>;

/**
 * Loads the Contact page's DB-driven section content, keyed by section
 * type, for spreading straight into each component's props. Mirrors
 * `getNameCorrectionSectionsSafely` exactly (see
 * `services/name-correction.service.ts`).
 */
export async function getContactSectionsSafely(): Promise<ContactSections> {
  try {
    const page = await getPageByIdOrSlugForViewer(CONTACT_PAGE_SLUG, null);
    const sections = await listActiveSectionsForPage(page.id);

    const result: Record<SectionType, unknown> = {} as Record<SectionType, unknown>;
    for (const section of sections) {
      const type = section.sectionType as SectionType;
      result[type] = section.data ?? {};
    }
    return result as ContactSections;
  } catch (error) {
    const log = error instanceof NotFoundError ? logger.warn : logger.error;
    log("Failed to load Contact page sections — falling back to built-in defaults", {
      error: error instanceof Error ? error.message : String(error),
    });
    return {};
  }
}

/** The Contact page's `Page` id, for `generateMetadata` to look up its
 * `SeoMetadata` row — returns `null` under the same "never break the
 * page" fallback as `getContactSectionsSafely`. */
export async function getContactPageSeoSafely() {
  try {
    const page = await getPageByIdOrSlugForViewer(CONTACT_PAGE_SLUG, null);
    return findByEntity("PAGE", page.id);
  } catch {
    return null;
  }
}
