import { z } from "zod";

export const createAirlineSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric words separated by hyphens"),
  iataCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(2, "IATA code must be exactly 2 characters"),
  icaoCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(3, "ICAO code must be exactly 3 letters")
    .optional(),
  country: z.string().trim().min(1, "Country is required"),
  countryCode: z.string().trim().toUpperCase().length(2, "Country code must be exactly 2 letters"),
  websiteUrl: z.string().trim().url("Enter a valid URL").optional(),
  description: z.string().trim().min(1).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export type CreateAirlineInput = z.infer<typeof createAirlineSchema>;
