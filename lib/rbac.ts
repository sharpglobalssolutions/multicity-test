import "server-only";
import { cookies } from "next/headers";
import { ForbiddenError } from "@/lib/errors";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { getCurrentUser, type AuthenticatedUser } from "@/services/auth.service";

/**
 * Resolves the authenticated user behind the current request's session
 * cookie. Every protected route handler should go through this — directly,
 * or via `requireRole`/`requirePermission` below — rather than reading the
 * cookie or verifying the token itself. `getCurrentUser` already throws
 * `UnauthorizedError` for every "not a valid, live session" case (missing,
 * malformed, expired, revoked, or belonging to a deactivated/deleted
 * user), so there's nothing left to check here.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return getCurrentUser(token);
}

/**
 * Non-throwing counterpart to `requireAuth`, for page/layout guards rather
 * than API routes — those render UI and should redirect a signed-out
 * visitor (see `app/admin/(protected)/layout.tsx`), not surface a JSON
 * `UnauthorizedError`. Returns `null` for every "not a valid, live
 * session" case instead of throwing.
 */
export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  try {
    return await requireAuth();
  } catch {
    return null;
  }
}

/**
 * Requires the caller to be authenticated *and* hold one of `roles` (by
 * name — e.g. `"SUPER_ADMIN"`). Throws `ForbiddenError` (403) if
 * authenticated but not in an allowed role; `requireAuth` still throws
 * `UnauthorizedError` (401) first if there's no valid session at all.
 *
 * Prefer `requirePermission` for feature endpoints — it lets access be
 * changed per-role in the database (see `prisma/seed.ts`) without a code
 * change. Reach for this only when the check is genuinely about the role
 * itself, e.g. reserving role/permission management for SUPER_ADMIN.
 */
export async function requireRole(...roles: string[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new ForbiddenError(`This action requires one of the following roles: ${roles.join(", ")}`);
  }
  return user;
}

/**
 * Requires the caller to be authenticated *and* hold `permission` (e.g.
 * `"pages.create"`) — the preferred check for feature endpoints. Throws
 * `ForbiddenError` (403) if authenticated but missing the permission;
 * `requireAuth` still throws `UnauthorizedError` (401) first if there's no
 * valid session at all.
 *
 * Permissions are resolved from the caller's role via `role_permissions`
 * (`AuthenticatedUser.permissions`, populated in
 * `services/auth.service.ts#getCurrentUser`), so granting or revoking
 * access to an action is a data change (edit `role_permissions`, or
 * `prisma/seed.ts`'s `ROLE_PERMISSIONS` map and re-seed), not a code
 * change to every call site that checks it.
 */
export async function requirePermission(permission: string): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!user.permissions.includes(permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}`);
  }
  return user;
}
