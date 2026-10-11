import { prisma } from "@/lib/prisma";

/** A singleton row (no entity key — just whichever `SiteSettings` row
 * exists first, matching the model's never-more-than-one-row intent). */
export function findSiteSettings() {
  return prisma.siteSettings.findFirst();
}

/** Creates the singleton row on first save (defaulting `siteName`, which
 * the model requires but this feature doesn't collect), otherwise updates
 * the existing one. */
export async function upsertSiteSettings(data: {
  headerCode?: string | null;
  bodyCode?: string | null;
  footerCode?: string | null;
}) {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    return prisma.siteSettings.update({ where: { id: existing.id }, data });
  }
  return prisma.siteSettings.create({ data: { siteName: "MultiCity Experts", ...data } });
}
