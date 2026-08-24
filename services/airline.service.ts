import type { Airline } from "@prisma/client";
import { ConflictError } from "@/lib/errors";
import { isUniqueConstraintError } from "@/lib/prisma-errors";
import { createAirline, listFeaturedAirlines } from "@/repositories/airline.repository";
import type { CreateAirlineInput } from "@/validations/airline.validation";

export async function createNewAirline(input: CreateAirlineInput) {
  try {
    return await createAirline(input);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("An airline with this slug or IATA/ICAO code already exists");
    }
    throw error;
  }
}

/** The shape any public-facing consumer sees (footer link lists, etc.) —
 * mirrors the {name, label, slug, url, type} shape used for destinations,
 * so the footer's three link columns share one item shape. */
function toPublicAirline(airline: Airline) {
  return {
    name: airline.name,
    label: airline.name,
    slug: airline.slug,
    url: airline.websiteUrl ?? "#",
    type: "airline" as const,
  };
}

export type PublicAirline = ReturnType<typeof toPublicAirline>;

export async function listTopAirlines(limit?: number): Promise<PublicAirline[]> {
  const airlines = await listFeaturedAirlines(limit);
  return airlines.map(toPublicAirline);
}
