import "server-only";
import { jwtVerify, SignJWT } from "jose";

/** Namespaced to avoid colliding with any other app's session cookie on the same host. */
export const SESSION_COOKIE_NAME = "mce_session";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

export interface SessionPayload {
  /** The authenticated user's id. */
  sub: string;
  /**
   * The value of `User.tokenVersion` at the time this token was issued.
   * Callers must compare this against the user's *current* tokenVersion
   * (fetched fresh from the database) — a mismatch means the session was
   * logged out after this token was signed, even though the token itself
   * hasn't expired yet. `lib/session.ts` only handles the crypto; it has
   * no database access, so it can't do that comparison itself.
   */
  tokenVersion: number;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Signs a session token carrying only the user id and token version — not
 * role/name/email — so a long-lived token can never serve stale
 * authorization data. Anything that needs the user's current role/status
 * should look it up fresh from the database using `sub`.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/**
 * Verifies a session token's signature and expiry, returning its payload
 * or `null` if the token is missing, expired, malformed, or has an
 * invalid signature. Never throws. Does **not** check `tokenVersion`
 * against the database — a valid-looking token can still belong to a
 * logged-out session; callers must check that themselves.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.tokenVersion !== "number") {
      return null;
    }
    return { sub: payload.sub, tokenVersion: payload.tokenVersion };
  } catch {
    return null;
  }
}
