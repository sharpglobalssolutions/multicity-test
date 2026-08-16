import { prisma } from "@/lib/prisma";

/**
 * Case-insensitive lookup — `users.email`'s unique index is
 * case-sensitive at the database level, but email addresses are
 * conventionally treated as case-insensitive, so login shouldn't fail
 * just because the casing doesn't match exactly.
 */
export function findUserByEmailWithRole(email: string) {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { role: true },
  });
}

export function findUserByIdWithRole(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
}

/** Invalidates every session token previously issued to this user. */
export function incrementTokenVersion(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}

/** Atomic increment — avoids a stale-read race if attempts arrive concurrently. */
export function incrementFailedLoginAttempts(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: { increment: 1 } },
  });
}

export function lockUserUntil(userId: string, lockedUntil: Date) {
  return prisma.user.update({
    where: { id: userId },
    data: { lockedUntil },
  });
}

/** Records a successful login: updates `lastLoginAt` and clears any lockout state. */
export function recordSuccessfulLogin(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null },
  });
}
