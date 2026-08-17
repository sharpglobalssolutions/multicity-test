import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric words separated by hyphens");

const iataCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(3, "IATA code must be exactly 3 letters")
  .regex(/^[A-Z]{3}$/, "IATA code must be 3 letters");

const icaoCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(4, "ICAO code must be exactly 4 letters")
  .regex(/^[A-Z]{4}$/, "ICAO code must be 4 letters");

export const createAirportSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: slugSchema,
  iataCode: iataCodeSchema,
  icaoCode: icaoCodeSchema.optional(),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  countryCode: z.string().trim().toUpperCase().length(2, "Country code must be exactly 2 letters"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().trim().min(1, "Timezone is required"),
  isActive: z.boolean().optional(),
});

export type CreateAirportInput = z.infer<typeof createAirportSchema>;

export const updateAirportSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    slug: slugSchema.optional(),
    iataCode: iataCodeSchema.optional(),
    icaoCode: icaoCodeSchema.optional(),
    city: z.string().trim().min(1, "City is required").optional(),
    country: z.string().trim().min(1, "Country is required").optional(),
    countryCode: z.string().trim().toUpperCase().length(2, "Country code must be exactly 2 letters").optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    timezone: z.string().trim().min(1, "Timezone is required").optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateAirportInput = z.infer<typeof updateAirportSchema>;
