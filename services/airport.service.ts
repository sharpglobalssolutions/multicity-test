import { ConflictError, NotFoundError } from "@/lib/errors";
import { isRecordNotFoundError, isUniqueConstraintError } from "@/lib/prisma-errors";
import { createAirport, updateAirport } from "@/repositories/airport.repository";
import type { CreateAirportInput, UpdateAirportInput } from "@/validations/airport.validation";

export async function createNewAirport(input: CreateAirportInput) {
  try {
    return await createAirport(input);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("An airport with this slug, IATA code, or ICAO code already exists");
    }
    throw error;
  }
}

export async function updateExistingAirport(id: string, input: UpdateAirportInput) {
  try {
    return await updateAirport(id, input);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Airport not found");
    }
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("An airport with this slug, IATA code, or ICAO code already exists");
    }
    throw error;
  }
}
