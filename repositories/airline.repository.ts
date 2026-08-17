import { prisma } from "@/lib/prisma";
import type { CreateAirlineInput } from "@/validations/airline.validation";

export function createAirline(input: CreateAirlineInput) {
  return prisma.airline.create({ data: input });
}
