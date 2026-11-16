import { prisma } from "@/lib/prisma";

/** A singleton row (no entity key — just whichever `SiteSettings` row
 * exists first, matching the model's never-more-than-one-row intent).
 * Includes the `favicon` Media relation so callers can read its URL
 * without a second query. */
export function findSiteSettings() {
  return prisma.siteSettings.findFirst({ include: { favicon: true } });
}

/** Creates the singleton row on first save (defaulting `siteName`, which
 * the model requires but this feature doesn't collect), otherwise updates
 * the existing one. */
export async function upsertSiteSettings(data: {
  faviconId?: string | null;
  headerCode?: string | null;
  bodyCode?: string | null;
  footerCode?: string | null;
  cookieConsentEnabled?: boolean;
  cookieConsentMessage?: string | null;
  cookieConsentAcceptLabel?: string | null;
  cookieConsentRejectLabel?: string | null;
  cookieConsentPolicyHref?: string | null;
  cookieConsentPrivacyHref?: string | null;
}) {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    return prisma.siteSettings.update({ where: { id: existing.id }, data, include: { favicon: true } });
  }
  return prisma.siteSettings.create({
    data: { siteName: "MultiCity Experts", ...data },
    include: { favicon: true },
  });
}
