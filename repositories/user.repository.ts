import { prisma } from "@/lib/prisma";

/**
 * Case-insensitive lookup — `users.email`'s unique index is
 * case-sensitive at the database level, but email addresses are
 * conventionally treated as case-insensitive, so login shouldn't fail
 * just because the casing doesn't match exactly.
 */
/** Pulls the role's assigned permission keys too (via `role_permissions`),
 * so callers can build a caller's permission set without a second query —
 * used by login/getCurrentUser to populate `AuthenticatedUser.permissions`
 * for the RBAC checks in `lib/rbac.ts`. */
const ROLE_WITH_PERMISSIONS = {
  role: { include: { rolePermissions: { include: { permission: true } } } },
} as const;

export function findUserByEmailWithRole(email: string) {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: ROLE_WITH_PERMISSIONS,
  });
}

export function findUserByIdWithRole(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: ROLE_WITH_PERMISSIONS,
  });
}

/** Same case-insensitive lookup as `findUserByEmailWithRole`, without the
 * unneeded `role` join — for callers (e.g. forgot-password) that don't
 * need it. */
export function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
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

/**
 * Used by both reset-password and change-password: sets the new hash,
 * bumps `tokenVersion` (invalidating every existing session — a password
 * reset/change is a strong signal to kill any session that isn't the
 * legitimate owner's), and clears any lockout state (the caller has just
 * proven ownership of the account, one way or another).
 */
export function updatePasswordAndInvalidateSessions(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      tokenVersion: { increment: 1 },
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}
