import { prisma } from "@/lib/prisma";
import type { CreateFlightOfferInput } from "@/validations/offer.validation";

export function createFlightOffer(input: CreateFlightOfferInput) {
  return prisma.flightOffer.create({ data: input });
}
