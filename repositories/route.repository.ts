import { prisma } from "@/lib/prisma";

/** Featured routes power the footer's "Top Routes" column — same shape as
 * `listFeaturedDestinations`/`listFeaturedAirlines`, joined to both
 * airports for the origin/destination city names. */
export function listFeaturedRoutes(limit?: number) {
  return prisma.route.findMany({
    where: { isActive: true, isFeatured: true },
    include: { originAirport: true, destinationAirport: true },
    orderBy: { createdAt: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}
