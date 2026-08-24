import type { Destination } from "@prisma/client";
import { listDistinctCountries, listFeaturedDestinations } from "@/repositories/destination.repository";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The shape any public-facing consumer sees — shared with airlines so the
 * footer's three link columns (Top Countries, Top Cities, Top Airlines)
 * all render from one item shape. There's no dedicated destination/country
 * landing page yet, so `url` points at the homepage's on-page destinations
 * section rather than a page that doesn't exist. */
interface PublicLinkItem {
  name: string;
  label: string;
  slug: string;
  url: string;
  type: "country" | "city";
}

export async function listTopCountries(limit?: number): Promise<PublicLinkItem[]> {
  const countries = await listDistinctCountries(limit);
  return countries.map(({ country }) => ({
    name: country,
    label: `${country} Business Class Flights`,
    slug: `${slugify(country)}-business-class-flights`,
    url: "#destinations",
    type: "country",
  }));
}

function toPublicCity(destination: Destination): PublicLinkItem {
  return {
    name: destination.city,
    label: `${destination.city} Business Class Flights`,
    slug: `${slugify(destination.city)}-business-class-flights`,
    url: "#destinations",
    type: "city",
  };
}

export async function listTopCities(limit?: number): Promise<PublicLinkItem[]> {
  const destinations = await listFeaturedDestinations(limit);
  return destinations.map(toPublicCity);
}
