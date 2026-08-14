import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Next.js dev mode reloads modules on every request, which would otherwise
 * create a new PrismaClient (and a new connection pool) each time. Caching
 * the instance on `globalThis` keeps a single client across reloads.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
