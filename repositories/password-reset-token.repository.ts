import { prisma } from "@/lib/prisma";

export function createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date) {
  return prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

/** A token is valid if it exists, hasn't been used, and hasn't expired. */
export function findValidPasswordResetToken(tokenHash: string) {
  return prisma.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  });
}

export function markPasswordResetTokenUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

/** Invalidates any other outstanding tokens for this user once one has
 * been consumed, so an older token from an earlier request can't still
 * be used afterward. */
export function invalidateOtherPasswordResetTokens(userId: string, exceptId: string) {
  return prisma.passwordResetToken.updateMany({
    where: { userId, usedAt: null, id: { not: exceptId } },
    data: { usedAt: new Date() },
  });
}
