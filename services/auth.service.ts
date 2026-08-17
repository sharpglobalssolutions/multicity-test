import { Prisma } from "@prisma/client";
import { ForbiddenError, UnauthorizedError, ValidationError } from "@/lib/errors";
import { DUMMY_PASSWORD_HASH, hashPassword, verifyPassword } from "@/lib/password";
import {
  createPasswordResetToken,
  findValidPasswordResetToken,
  invalidateOtherPasswordResetTokens,
  markPasswordResetTokenUsed,
} from "@/repositories/password-reset-token.repository";
import { generateResetToken, hashResetToken } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import {
  findUserByEmail,
  findUserByEmailWithRole,
  findUserByIdWithRole,
  incrementFailedLoginAttempts,
  incrementTokenVersion,
  lockUserUntil,
  recordSuccessfulLogin,
  updatePasswordAndInvalidateSessions,
} from "@/repositories/user.repository";

/** Consecutive failed attempts (for one account) before it's locked. */
const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/** How long an account stays locked once the threshold is crossed. */
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/** How long a password reset token stays valid after being requested. */
const PASSWORD_RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  /** Permission keys (e.g. `"pages.create"`) granted to this user's role
   * via `role_permissions` — see `prisma/seed.ts` for the catalog and
   * `lib/rbac.ts` for how these are enforced. */
  permissions: string[];
}

/** Flattens a role (with its `rolePermissions` join loaded) down to the
 * plain permission-key list `AuthenticatedUser.permissions` carries. */
function permissionKeysForRole(role: { rolePermissions: { permission: { key: string } }[] }): string[] {
  return role.rolePermissions.map((rolePermission) => rolePermission.permission.key);
}

export interface LoginResult {
  user: AuthenticatedUser;
  sessionToken: string;
}

/** Generic message for every "this session doesn't work" case — never say
 * whether it's missing, malformed, expired, revoked (logged out), or
 * belongs to a deleted user. That distinction is only useful to an
 * attacker probing session state. */
const NOT_AUTHENTICATED_MESSAGE = "Not authenticated";

/**
 * Authenticates an email/password pair and issues a session token.
 *
 * Security notes:
 * - The password compare always runs *before* any branching, even when no
 *   user is found (against `DUMMY_PASSWORD_HASH`) or the account is
 *   locked, so response time never reveals whether an email is
 *   registered or currently locked out.
 * - "Wrong password", "no such user", and "this account is locked" all
 *   return the identical error — never say which one it was. Revealing
 *   lockout state would let an attacker distinguish "real email, now
 *   locked" from "not a real email" after enough guesses, defeating the
 *   same enumeration protection the wrong-password/unknown-email case
 *   relies on. The lockout still fully blocks the login — even a
 *   correct password is rejected while locked — it's just silent.
 * - The inactive-account check happens only *after* the password has
 *   been verified, so an attacker who doesn't know the password can't
 *   use this endpoint to learn whether an account exists or is disabled.
 * - A locked account whose lock has since expired is treated as unlocked
 *   (no special-casing needed — `lockedUntil > now` simply becomes
 *   false).
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await findUserByEmailWithRole(email);

  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

  const isLocked = Boolean(user?.lockedUntil && user.lockedUntil.getTime() > Date.now());

  if (!user || !passwordMatches || isLocked) {
    if (user && !isLocked) {
      await registerFailedLoginAttempt(user.id);
    }
    throw new UnauthorizedError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new ForbiddenError("This account has been deactivated");
  }

  await recordSuccessfulLogin(user.id);

  const sessionToken = await createSessionToken({ sub: user.id, tokenVersion: user.tokenVersion });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      permissions: permissionKeysForRole(user.role),
    },
    sessionToken,
  };
}

/**
 * Increments the account's failed-attempt counter and, if it crosses
 * `MAX_FAILED_LOGIN_ATTEMPTS`, locks the account for `LOCKOUT_DURATION_MS`.
 */
async function registerFailedLoginAttempt(userId: string): Promise<void> {
  const updated = await incrementFailedLoginAttempts(userId);
  if (updated.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
    await lockUserUntil(userId, new Date(Date.now() + LOCKOUT_DURATION_MS));
  }
}

/**
 * Resolves the user behind a session cookie's token, for `GET /me` and
 * anything else that needs to protect a route. Throws `UnauthorizedError`
 * for every "not a valid, live session" case — missing token, bad
 * signature, expired, deleted user, or a token whose `tokenVersion` no
 * longer matches the user's current one (i.e. they logged out since this
 * token was issued).
 */
export async function getCurrentUser(token: string | undefined): Promise<AuthenticatedUser> {
  if (!token) {
    throw new UnauthorizedError(NOT_AUTHENTICATED_MESSAGE);
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    throw new UnauthorizedError(NOT_AUTHENTICATED_MESSAGE);
  }

  const user = await findUserByIdWithRole(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedError(NOT_AUTHENTICATED_MESSAGE);
  }

  if (!user.isActive) {
    throw new ForbiddenError("This account has been deactivated");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    permissions: permissionKeysForRole(user.role),
  };
}

/**
 * Logs out the session behind a token, if any. Bumps the user's
 * `tokenVersion`, which immediately invalidates this token — and every
 * other token issued to them before now — server-side, regardless of
 * whether the client actually discards its cookie. Idempotent: logging
 * out with no token, or an already-invalid one, is not an error.
 */
export async function logout(token: string | undefined): Promise<void> {
  if (!token) return;

  const payload = await verifySessionToken(token);
  if (!payload) return;

  try {
    await incrementTokenVersion(payload.sub);
  } catch (error) {
    // The user may have been deleted since this token was issued — fine,
    // there's nothing left to invalidate. Any other error (e.g. the
    // database being unreachable) should still surface as a real error
    // rather than be silently treated as a successful logout.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return;
    }
    throw error;
  }
}

/**
 * Requests a password reset for `email`. **Never** reveals whether the
 * email is registered — always resolves successfully regardless, so the
 * caller (route handler) can return the identical response either way.
 *
 * Sends the reset link via `sendPasswordResetEmail` (falls back to logging
 * if SMTP isn't configured yet — see `lib/mail.ts`). A send failure is
 * caught and logged rather than thrown: letting it propagate would make
 * this endpoint respond differently (500 vs. 200) depending on whether the
 * email was registered, defeating the whole point of this function.
 */
export async function forgotPassword(email: string): Promise<void> {
  const user = await findUserByEmail(email);
  if (!user) {
    return;
  }

  const rawToken = generateResetToken();
  const tokenHash = hashResetToken(rawToken);

  await createPasswordResetToken(user.id, tokenHash, new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MS));

  try {
    await sendPasswordResetEmail(user.email, rawToken);
  } catch (error) {
    logger.error("Failed to send password reset email", {
      userId: user.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * Completes a password reset given the raw token from `forgotPassword`.
 * Invalid, expired, or already-used tokens all produce the same generic
 * error — same reasoning as login's "invalid credentials": don't give an
 * attacker guessing tokens any signal about *why* one didn't work.
 *
 * On success: hashes and stores the new password, invalidates every
 * existing session (`tokenVersion` bump) and any lockout state, marks
 * this token used, and invalidates any other outstanding reset tokens
 * for the account so an older, unused token can't be replayed after a
 * newer request already completed the reset.
 */
export async function resetPassword(rawToken: string, newPassword: string): Promise<void> {
  const tokenHash = hashResetToken(rawToken);
  const resetToken = await findValidPasswordResetToken(tokenHash);
  if (!resetToken) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const user = await findUserByIdWithRole(resetToken.userId);
  if (!user) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const isSameAsCurrent = await verifyPassword(newPassword, user.passwordHash);
  if (isSameAsCurrent) {
    throw new ValidationError("New password must be different from the current password");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updatePasswordAndInvalidateSessions(user.id, newPasswordHash);
  await markPasswordResetTokenUsed(resetToken.id);
  await invalidateOtherPasswordResetTokens(user.id, resetToken.id);
}

/**
 * Changes the password for an already-authenticated user (`userId` comes
 * from a verified session — see `getCurrentUser`). Requires the current
 * password as an extra factor; unlike login/reset, it's fine to say
 * specifically that it was wrong, since presenting a valid session
 * already proves the caller controls the account.
 *
 * Invalidates every existing session (including the one making this
 * request — the route handler clears its own cookie afterward) via the
 * same `tokenVersion` bump reset-password uses.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await findUserByIdWithRole(userId);
  if (!user) {
    throw new UnauthorizedError(NOT_AUTHENTICATED_MESSAGE);
  }

  const currentPasswordMatches = await verifyPassword(currentPassword, user.passwordHash);
  if (!currentPasswordMatches) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  if (newPassword === currentPassword) {
    throw new ValidationError("New password must be different from the current password");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await updatePasswordAndInvalidateSessions(user.id, newPasswordHash);
}
