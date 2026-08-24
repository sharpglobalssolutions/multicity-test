import { prisma } from "@/lib/prisma";

/** Featured destinations power the footer's "Top Cities" column — one row
 * per city, so it's a plain findMany. */
export function listFeaturedDestinations(limit?: number) {
  return prisma.destination.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { name: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

/** "Top Countries" has no dedicated Country model — country is a plain
 * string duplicated across every Destination row — so the distinct list
 * comes from `groupBy` rather than a normal findMany. */
export async function listDistinctCountries(limit?: number) {
  const groups = await prisma.destination.groupBy({
    by: ["country", "countryCode"],
    where: { isActive: true },
    orderBy: { country: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return groups.map((group) => ({ country: group.country, countryCode: group.countryCode }));
}
