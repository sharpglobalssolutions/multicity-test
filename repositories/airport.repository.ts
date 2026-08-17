import { prisma } from "@/lib/prisma";
import type { CreateAirportInput, UpdateAirportInput } from "@/validations/airport.validation";

export function createAirport(input: CreateAirportInput) {
  return prisma.airport.create({ data: input });
}

export function updateAirport(id: string, input: UpdateAirportInput) {
  return prisma.airport.update({ where: { id }, data: input });
}
