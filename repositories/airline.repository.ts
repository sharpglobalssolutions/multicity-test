import { prisma } from "@/lib/prisma";
import type { CreateAirlineInput } from "@/validations/airline.validation";

export function createAirline(input: CreateAirlineInput) {
  return prisma.airline.create({ data: input });
}

export function listFeaturedAirlines(limit?: number) {
  return prisma.airline.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { sortOrder: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}
