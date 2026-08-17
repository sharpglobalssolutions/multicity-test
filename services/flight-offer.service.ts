import { ValidationError } from "@/lib/errors";
import { isForeignKeyConstraintError } from "@/lib/prisma-errors";
import { createFlightOffer } from "@/repositories/flight-offer.repository";
import type { CreateFlightOfferInput } from "@/validations/offer.validation";

export async function createNewFlightOffer(input: CreateFlightOfferInput) {
  try {
    return await createFlightOffer(input);
  } catch (error) {
    if (isForeignKeyConstraintError(error)) {
      throw new ValidationError("airlineId does not reference an existing airline");
    }
    throw error;
  }
}
