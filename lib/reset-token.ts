import "server-only";
import { createHash, randomBytes } from "crypto";

/** 256 bits of entropy — infeasible to guess, so unlike a password this
 * doesn't need a slow/salted hash to be safe at rest. */
const RESET_TOKEN_BYTES = 32;

/** The value handed to the requester (currently logged, not emailed —
 * see services/auth.service.ts). Never store this raw value. */
export function generateResetToken(): string {
  return randomBytes(RESET_TOKEN_BYTES).toString("hex");
}

/** SHA-256 — deliberately not bcrypt. The token is already high-entropy
 * random data, so a fast cryptographic hash is sufficient to make the
 * stored value useless without the original token; bcrypt's intentional
 * slowness exists to compensate for low-entropy human-chosen passwords,
 * which doesn't apply here. */
export function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
