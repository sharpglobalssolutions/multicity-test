import { Prisma } from "@prisma/client";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "@/lib/password";
import { createSessionToken, verifySessionToken } from "@/lib/session";
import {
  findUserByEmailWithRole,
  findUserByIdWithRole,
  incrementFailedLoginAttempts,
  incrementTokenVersion,
  lockUserUntil,
  recordSuccessfulLogin,
} from "@/repositories/user.repository";

/** Consecutive failed attempts (for one account) before it's locked. */
const MAX_FAILED_LOGIN_ATTEMPTS = 5;

/** How long an account stays locked once the threshold is crossed. */
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
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
