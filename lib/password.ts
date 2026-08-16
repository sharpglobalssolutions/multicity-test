import "server-only";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * A valid bcrypt hash of an arbitrary, unused value — not tied to any
 * real account. Used by callers that need to run a password comparison
 * even when no user was found, so a login attempt takes the same amount
 * of time whether or not the email exists. Without this, an attacker
 * could tell emails apart by response time (an existing email pays the
 * cost of a real bcrypt compare; a nonexistent one wouldn't).
 */
export const DUMMY_PASSWORD_HASH =
  "$2a$12$.NkIzVZscqCYx3VEmSBmd.1zu2q4iWySQaIH2glPZLpQbg.g5b4tC";

export function hashPassword(plainTextPassword: string): Promise<string> {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export function verifyPassword(plainTextPassword: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, passwordHash);
}
