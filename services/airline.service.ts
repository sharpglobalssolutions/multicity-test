import { ConflictError } from "@/lib/errors";
import { isUniqueConstraintError } from "@/lib/prisma-errors";
import { createAirline } from "@/repositories/airline.repository";
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
