import { recordAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { findSiteSettings, upsertSiteSettings } from "@/repositories/site-settings.repository";
import type { UpdateSiteSettingsInput } from "@/validations/site-settings.validation";

export async function getSiteSettings() {
  return findSiteSettings();
}

/** Used by the public site (root layout) to read `headerCode`/`bodyCode`/
 * `footerCode` — never breaks the page on a DB error, same "never break
 * the page" fallback every other `get*Safely` function in this codebase
 * uses. */
export async function getSiteSettingsSafely() {
  try {
    return await findSiteSettings();
  } catch (error) {
    logger.error("Failed to load site settings — header/footer scripts will not render", {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

export async function updateSiteSettings(input: UpdateSiteSettingsInput, userId: string, ip: string) {
  const before = await findSiteSettings();
  const updated = await upsertSiteSettings(input);

  await recordAuditLog({
    userId,
    action: before ? "UPDATE" : "CREATE",
    entityType: "SiteSettings",
    entityId: updated.id,
    oldData: before,
    newData: updated,
    ipAddress: ip,
  });

  return updated;
}
