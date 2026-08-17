import { CabinClass } from "@prisma/client";
import { z } from "zod";

export const createFlightOfferSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  airlineId: z.string().trim().min(1, "airlineId is required"),
  cabinClass: z.nativeEnum(CabinClass),
  price: z.number().positive("Price must be greater than 0"),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3, "Currency must be a 3-letter ISO code (e.g. USD)"),
  originalPrice: z.number().positive().optional(),
  offerLabel: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  validFrom: z.coerce.date().optional(),
  validUntil: z.coerce.date().optional(),
});

export type CreateFlightOfferInput = z.infer<typeof createFlightOfferSchema>;
