# MultiCityExperts — Backend Foundation

This repository currently contains **only the backend foundation** for
MultiCityExperts: a Next.js API layer, Prisma/PostgreSQL wiring, and the
folder structure future features (flights, airports, airlines, offers,
blog, CMS, admin dashboard, public site, SEO) will be built into, plus a
working admin auth slice: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`
(protected), and `POST /api/v1/auth/logout`. No UI or other business APIs
exist yet — this is intentionally infrastructure-only, with auth as the
first real slice of business logic built on top of it.

## Tech stack

- **Next.js** (App Router) — used purely for its `app/api` route handlers
- **TypeScript** (strict mode)
- **PostgreSQL** via **Prisma**
- **Zod** for request validation

## Architecture

REST API, layered so each piece has one job and depends only on the layer
below it:

```
route handler (app/api/v1/**)
        │  parses request, calls a service, formats the response
        ▼
   services/
        │  business logic, orchestrates repositories
        ▼
 repositories/
        │  Prisma queries — the only layer that touches the database
        ▼
   prisma/  (PostgreSQL)
```

`validations/` (Zod schemas) sits alongside this and is used by route
handlers to validate input before it ever reaches a service. `types/`
holds shared TypeScript types (e.g. the API response envelope) that don't
belong to any single layer.

### Why this layering

- **Route handlers stay thin.** They validate input, call a service, and
  map the result to an HTTP response — no business rules or Prisma calls
  live here.
- **Services hold business logic** and are plain TypeScript, so they're
  testable without spinning up Next.js or mocking HTTP.
- **Repositories are the only place that imports `lib/prisma.ts`.** If the
  ORM or schema ever changes, the blast radius is contained to this layer.
- **Services never call each other's repositories directly** — cross-domain
  work is coordinated at the service layer.

## Folder structure

```
app/api/v1/       REST route handlers, one folder per resource
  health/
    route.ts                GET /api/v1/health — verifies DB connectivity
  auth/
    login/route.ts           POST /api/v1/auth/login — admin login
    me/route.ts               GET /api/v1/auth/me — current user (protected)
    logout/route.ts           POST /api/v1/auth/logout — invalidate session
    forgot-password/route.ts  POST /api/v1/auth/forgot-password
    reset-password/route.ts   POST /api/v1/auth/reset-password
    change-password/route.ts  POST /api/v1/auth/change-password (protected)
  pages/
    route.ts                  POST /api/v1/pages (requires pages.create)
    [id]/route.ts              PATCH /api/v1/pages/:id (pages.update),
                                DELETE /api/v1/pages/:id (pages.delete)
  airports/
    route.ts                  POST /api/v1/airports (airports.create)
    [id]/route.ts               PATCH /api/v1/airports/:id (airports.update)
  airlines/
    route.ts                  POST /api/v1/airlines (airlines.create)
  offers/
    route.ts                  POST /api/v1/offers (offers.create)
  blog/
    [id]/publish/route.ts       POST /api/v1/blog/:id/publish (blog.publish)
  seo/
    route.ts                  POST /api/v1/seo — upsert by (entityType, entityId) (seo.update)

lib/               Framework-agnostic infrastructure
  prisma.ts          Prisma client singleton (server-only)
  prisma-errors.ts   Prisma error-code type guards (unique/FK/not-found violations)
  api-response.ts    apiSuccess() / apiError() response builders
  errors.ts          ErrorCode enum + AppError and its typed subclasses
  handle-error.ts    Converts thrown errors into a consistent API response
  validation.ts      Reusable Zod helpers (validateJsonBody, validateParams, idParamSchema, etc.)
  rbac.ts            requireAuth(), requireRole(), requirePermission() — see "RBAC" below
  logger.ts          Minimal structured (JSON line) logger, server-only
  password.ts        bcrypt hash/verify (server-only)
  session.ts          Session JWT create/verify + cookie name (server-only)
  reset-token.ts       Password reset token generate/hash (server-only)
  rate-limit.ts        In-memory per-key rate limiter + client IP helper
  mail.ts              SMTP send via nodemailer, with a logging fallback (server-only)

services/          Business logic
  auth.service.ts     login(), getCurrentUser(), logout(), forgotPassword(),
                      resetPassword(), changePassword()
  page.service.ts     createPageForUser(), updatePageForUser(), deletePageById()
  airport.service.ts  createNewAirport(), updateExistingAirport()
  airline.service.ts  createNewAirline()
  flight-offer.service.ts createNewFlightOffer()
  blog.service.ts     publishExistingBlogPost()
  seo.service.ts      upsertSeoMetadataForEntity()
repositories/       Data access via Prisma
  user.repository.ts               findUserByEmailWithRole(), findUserByEmail(),
                                    findUserByIdWithRole(), recordSuccessfulLogin(),
                                    incrementTokenVersion(), incrementFailedLoginAttempts(),
                                    lockUserUntil(), updatePasswordAndInvalidateSessions()
  password-reset-token.repository.ts createPasswordResetToken(),
                                    findValidPasswordResetToken(),
                                    markPasswordResetTokenUsed(),
                                    invalidateOtherPasswordResetTokens()
  page.repository.ts, airport.repository.ts, airline.repository.ts,
  flight-offer.repository.ts, blog-post.repository.ts,
  seo-metadata.repository.ts       Thin Prisma CRUD backing the example
                                    permission-gated endpoints above
validations/        Zod request schemas
  auth.validation.ts loginSchema, forgotPasswordSchema, resetPasswordSchema,
                     changePasswordSchema
  page.validation.ts, airport.validation.ts, airline.validation.ts,
  offer.validation.ts, seo.validation.ts   Schemas for the example endpoints above
types/              Shared TypeScript types
  api.ts             ApiResponse<T> / ApiSuccess<T> / ApiError envelope

prisma/
  schema.prisma      Datasource + generator config, auth models (see below)
  migrations/          Generated SQL migrations
  seed.ts              Seeds roles, permissions, and role-permission assignments
```

## API conventions

All routes live under `/api/v1` and return one of two shapes.

Success:

```json
{
  "success": true,
  "data": { "...": "..." },
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": []
  }
}
```

Route handlers build these with `apiSuccess()` / `apiError()` from
`lib/api-response.ts`. `details` is an array of `{ field?, message }`
entries — populated for validation errors (one entry per invalid field),
empty otherwise.

### Error handling

`code` is always one of the values in the `ErrorCode` const object
exported from `lib/errors.ts`:

| Code                    | HTTP status | Thrown via              |
| ----------------------- | ----------- | ------------------------ |
| `VALIDATION_ERROR`      | 422         | `ValidationError`        |
| `UNAUTHORIZED`          | 401         | `UnauthorizedError`      |
| `FORBIDDEN`             | 403         | `ForbiddenError`         |
| `NOT_FOUND`             | 404         | `NotFoundError`          |
| `CONFLICT`              | 409         | `ConflictError`          |
| `RATE_LIMITED`          | 429         | `RateLimitError`         |
| `DATABASE_ERROR`        | 503         | `DatabaseError`          |
| `INTERNAL_SERVER_ERROR` | 500         | `InternalServerError`    |

Route handlers, services, and repositories should `throw` these — never
build an error response by hand — and let `handleApiError()` in
`lib/handle-error.ts` do the translation:

```ts
export async function GET() {
  try {
    // ...
  } catch (error) {
    return handleApiError(error);
  }
}
```

`handleApiError()` also normalizes two error sources it didn't throw
itself, so nothing downstream needs a special case for them:

- A `ZodError` (e.g. from a schema's `.parse()` used outside
  `lib/validation.ts`) → `VALIDATION_ERROR`, 422, with one `details` entry
  per invalid field.
- Any Prisma client error (`PrismaClientKnownRequestError`, connection
  failures, etc.) bubbling up from a repository → `DATABASE_ERROR`, 503.
- Anything else (a genuinely unexpected exception) → `INTERNAL_SERVER_ERROR`,
  500, logged via `lib/logger.ts` before responding.

### Validation

`lib/validation.ts` wraps Zod so every validation failure — regardless of
whether it came from a request body, query string, or route params —
throws the same `ValidationError`:

```ts
import { z } from "zod";
import { validateJsonBody, validateSearchParams } from "@/lib/validation";

const createWidgetSchema = z.object({ name: z.string().min(1) });
const body = await validateJsonBody(request, createWidgetSchema);

const listQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1) });
const query = validateSearchParams(request.nextUrl.searchParams, listQuerySchema);
```

Malformed JSON bodies are treated as a validation failure too (422), not
a 500 — the caller sent something invalid, not the server.

Use `lib/logger.ts` (`logger.info/warn/error/debug`) instead of
`console.*` directly — it's guarded with the `server-only` package so it
can never end up in a client bundle, and emits structured JSON lines that
are easy to ship to a log aggregator later.

## Endpoints

| Method | Path                            | Description                                              |
| ------ | -------------------------------- | ---------------------------------------------------------- |
| GET    | `/api/v1/health`                | Liveness check — verifies the API can reach PostgreSQL     |
| POST   | `/api/v1/auth/login`            | Admin login — verifies email/password, issues a session    |
| GET    | `/api/v1/auth/me`               | Returns the currently authenticated user. **Protected.**   |
| POST   | `/api/v1/auth/logout`           | Invalidates the current session, server-side and client-side. |
| POST   | `/api/v1/auth/forgot-password`  | Requests a password reset token. Never reveals whether the email exists. |
| POST   | `/api/v1/auth/reset-password`   | Completes a reset using the token from forgot-password.    |
| POST   | `/api/v1/auth/change-password`  | Changes the password for the current session. **Protected.** |

`GET /api/v1/health` runs `SELECT 1` through Prisma. On success:

```json
{ "success": true, "data": { "status": "ok", "database": "connected" }, "meta": {} }
```

If the database is unreachable, it returns HTTP 503 with
`error.code: "DATABASE_ERROR"` instead of throwing.

### `POST /api/v1/auth/login`

Body: `{ "email": string, "password": string }`.

On success (200):

```json
{ "success": true, "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "ADMIN" } }, "meta": {} }
```

`passwordHash` is never included in the response. The session itself is
delivered only via a `Set-Cookie` header (`mce_session`, `HttpOnly`,
`SameSite=Lax`, `Secure` in production, 24h expiry) — never in the JSON
body — so client-side JS can't read or exfiltrate it. The cookie holds a
`jose`-signed JWT containing only the user's id (`lib/session.ts`); role
and status are always looked up fresh from the database rather than
trusted from the token, so a long-lived session can't carry stale
authorization data.

Failure responses:

| Scenario                                     | Status | `error.code`       |
| ----------------------------------------------- | ------ | ------------------- |
| Wrong password, unknown email, **or locked account** | 401 | `UNAUTHORIZED`       |
| Correct password, inactive account               | 403    | `FORBIDDEN`          |
| Missing/invalid `email`/`password`, oversized body | 422  | `VALIDATION_ERROR`   |
| Too many requests from this IP (see below)       | 429    | `RATE_LIMITED`       |
| Database unreachable                             | 503    | `DATABASE_ERROR`     |

Wrong-password, unknown-email, and **locked-account** all intentionally
return the **identical** response — never reveal which one it was (see
"Brute-force protection" below for why locked-account is folded in too).
`services/auth.service.ts` also runs the bcrypt compare even when no user
is found (against a precomputed dummy hash in `lib/password.ts`), so
response time doesn't leak whether an email is registered either. The
inactive-account check only runs *after* the password has been verified,
so an attacker who doesn't know the password can't use this endpoint to
probe whether an account exists or is disabled.

Passwords are hashed with bcrypt (12 salt rounds, `lib/password.ts`) —
`hashPassword()` isn't called anywhere yet since there's no
create-user/register flow in scope, but it's there for when one is
built.

#### Brute-force protection

Two independent, complementary layers — neither replaces the other:

1. **Per-account lockout** (`User.failedLoginAttempts`/`lockedUntil`,
   checked in `services/auth.service.ts`). 5 consecutive failed attempts
   against one email locks it for 15 minutes — **even the correct
   password is rejected while locked**, and the response is identical to
   a plain wrong password, so an outside observer can't tell "wrong
   password" from "locked out" (that distinction would itself leak that
   the email is a real, actively-targeted account). The lock expires
   automatically — no unlock action needed — and a successful login
   resets the counter to 0. This is what stops an attacker who spreads
   guesses across many IPs/proxies at one account.
2. **Per-IP rate limit** (`lib/rate-limit.ts`, applied in the login route
   itself). 10 requests per 15 minutes per source IP, regardless of which
   email is being tried, returns 429 with a `Retry-After` header (seconds
   until the window resets). This is what stops one source hammering the
   endpoint at volume, independent of whether it's targeting one account
   or spraying many.

The rate limiter is **in-memory and per-process** — there's no shared
store (Redis, etc.) in this project yet, so in a multi-instance
deployment each instance enforces the limit independently (the
*effective* limit scales with instance count). IP extraction trusts the
`X-Forwarded-For`/`X-Real-IP` headers, which is only safe behind a proxy
that sets them itself and strips client-supplied values (true on Vercel
and most managed platforms) — swap `lib/rate-limit.ts`'s in-memory `Map`
for a shared store if this ever runs on more than one instance, or if
it's deployed without a trusted proxy in front of it.

### `GET /api/v1/auth/me` (protected)

Reads the `mce_session` cookie, verifies it, and returns the current
user. No body.

Success (200):

```json
{ "success": true, "data": { "user": { "id": "...", "name": "...", "email": "...", "role": "ADMIN" } }, "meta": {} }
```

Failure responses:

| Scenario                                              | Status | `error.code`   |
| ------------------------------------------------------- | ------ | -------------- |
| No cookie / malformed / bad signature / expired          | 401    | `UNAUTHORIZED` |
| Valid token, but logged out since (stale `tokenVersion`) | 401    | `UNAUTHORIZED` |
| Valid token, but the user no longer exists               | 401    | `UNAUTHORIZED` |
| Valid token, account since deactivated                   | 403    | `FORBIDDEN`    |
| Database unreachable                                     | 503    | `DATABASE_ERROR` |

Every "this session doesn't work" case above returns the identical
`"Not authenticated"` message — deliberately not distinguishing expired
vs. revoked vs. malformed, the same enumeration-prevention reasoning as
login. The one exception is a deactivated account: that's returned
distinctly (403), the same as at login, since presenting a valid session
already proves you previously authenticated successfully — there's no
new information being leaked to someone who doesn't have the password.

### `POST /api/v1/auth/logout`

No body required. Always returns 200 (idempotent — logging out with no
session, or an already-invalid one, isn't an error):

```json
{ "success": true, "data": { "loggedOut": true }, "meta": {} }
```

This is a **real, server-side invalidation**, not just a cookie clear.
Every `User` has a `tokenVersion` column; each session JWT embeds the
value it was issued under, and `GET /me` (and anything else that checks
sessions) compares that against the user's *current* `tokenVersion` from
the database. Logout increments it. That means:

- The specific token used to log out — and every other token issued to
  that user before this moment — is rejected from then on, even if
  someone copied it out of the browser and replays it directly against
  `/me`. Verified by testing exactly that: logging out, then presenting
  the pre-logout cookie value straight to `/me`, gets `401` even though
  the JWT itself hasn't expired.
- The cookie is also cleared (`Max-Age=0`) as a courtesy to the calling
  browser, but that's not what makes the session invalid — the
  `tokenVersion` bump is.

This is the reason `lib/session.ts` keeps `tokenVersion` in the JWT
payload alongside `sub`: verifying a token's signature/expiry (which
`lib/session.ts` can do on its own, with no database) is not the same
question as "is this session still alive" (which needs a fresh DB read,
done in `services/auth.service.ts`).

### `POST /api/v1/auth/forgot-password`

Body: `{ "email": string }`. **Always** returns the identical 200
response, whether or not the email is registered:

```json
{ "success": true, "data": { "message": "If an account with that email exists, a password reset link has been sent." }, "meta": {} }
```

`services/auth.service.ts#forgotPassword` silently no-ops for an unknown
email — it never throws a distinguishing error, so there's nothing for
the route to accidentally leak. Rate limited (5 requests / 15 min per
IP) — not to stop guessing (the response gives nothing away either way),
but to stop the endpoint being used to spam a target's inbox once a real
email provider is wired up.

The reset link is emailed via `lib/mail.ts#sendPasswordResetEmail`, using
generic SMTP through `nodemailer` — configured with `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` (see
`.env.example`). **If any of those are unset, `sendMail()` falls back to
logging the message instead of sending it** (`"SMTP not configured —
logging email instead of sending"`, visible in server logs only, never in
any API response), so the reset flow stays fully testable end-to-end
before real credentials exist.

A send failure (bad credentials, provider down, etc.) is caught inside
`forgotPassword()` and logged rather than thrown — letting it propagate
would make this endpoint return 500 only when the email is registered
(since unregistered emails never reach the send step), which leaks exactly
the thing this endpoint exists to hide. The response is always the
identical 200 above regardless of whether the email actually went out.

The token itself: `lib/reset-token.ts` generates 32 random bytes (256
bits — infeasible to guess) and stores only its SHA-256 hash
(`PasswordResetToken.tokenHash`, unique) — deliberately **not** bcrypt,
since the token is already high-entropy random data with no low-entropy
human-choice pattern for a slow hash to protect against. It expires after
1 hour (`PASSWORD_RESET_TOKEN_EXPIRY_MS`).

### `POST /api/v1/auth/reset-password`

Body: `{ "token": string, "newPassword": string }` (8–72 characters — 72
because that's bcrypt's effective input limit; longer is silently
truncated by the hash, so it's rejected here instead of quietly not
mattering).

```json
{ "success": true, "data": { "message": "Password has been reset successfully. Please log in with your new password." }, "meta": {} }
```

Failure responses:

| Scenario                                                  | Status | `error.code`      |
| ------------------------------------------------------------ | ------ | ------------------ |
| Invalid, expired, or already-used token                       | 401    | `UNAUTHORIZED`      |
| New password same as the current one                          | 422    | `VALIDATION_ERROR`  |
| Missing/invalid `token`/`newPassword`                          | 422    | `VALIDATION_ERROR`  |
| Too many requests from this IP                                | 429    | `RATE_LIMITED`      |
| Database unreachable                                           | 503    | `DATABASE_ERROR`    |

Invalid, expired, and already-used tokens all return the identical
error — same enumeration-prevention reasoning as login. Verified by
testing all three directly: a garbage token, a token crafted with a
past `expiresAt`, and replaying a token a second time after it was
already consumed — all `401`, same message.

On success: hashes and stores the new password, bumps `tokenVersion`
(invalidating **every** existing session for that user — a password
reset is a strong enough signal to kill any session that isn't the
legitimate owner's), clears any lockout state, marks the token used, and
**invalidates every other outstanding reset token for that account** —
verified by requesting two tokens, using the second one, then confirming
the first (older, never-used) token is rejected too, not just the one
that was actually used.

### `POST /api/v1/auth/change-password` (protected)

For a user who's already logged in and knows their current password.
Body: `{ "currentPassword": string, "newPassword": string }` (same 8–72
rule as reset). Requires a valid session, same as `/me`.

```json
{ "success": true, "data": { "message": "Password changed successfully. Please log in again." }, "meta": {} }
```

Failure responses:

| Scenario                                       | Status | `error.code`      |
| --------------------------------------------------- | ------ | ------------------ |
| Not authenticated (no/invalid/expired session)       | 401    | `UNAUTHORIZED`      |
| Wrong `currentPassword`                              | 401    | `UNAUTHORIZED`      |
| New password same as current, or missing/invalid fields | 422 | `VALIDATION_ERROR`  |
| Too many requests from this IP                       | 429    | `RATE_LIMITED`      |
| Database unreachable                                 | 503    | `DATABASE_ERROR`    |

Unlike login/reset, "current password is incorrect" is a distinct,
specific message — presenting a valid session already proves the caller
controls the account, so there's no enumeration value in being vague
here the way there is at login.

On success, this bumps `tokenVersion` the same way reset-password does
— invalidating every session for that user, **including the one making
this request** — and the route clears its own cookie in response,
since it just made that cookie's token invalid. Verified: change the
password, then present that same pre-change cookie to `/me` — `401`,
even though nothing expired. Logging in again requires the new password;
the old one no longer works.

## RBAC (role-based access control)

Every write endpoint beyond auth itself is gated **server-side** — the
client never decides what it's allowed to do; it only finds out by
trying. There's no separate "admin" build or hidden route: any request
that reaches a protected handler without the right session/role/permission
gets rejected before it touches a service or the database, and a frontend
that hides a button is a UX nicety only, never the actual access control.

### Roles

Five fixed roles, seeded by `prisma/seed.ts` (`ROLES`/`ROLE_PERMISSIONS`):

| Role              | Intent                                                               |
| ----------------- | --------------------------------------------------------------------- |
| `SUPER_ADMIN`     | Every permission, including `roles.update`/`permissions.update`.      |
| `ADMIN`           | Every permission *except* the two access-control ones above.          |
| `SEO_MANAGER`     | `seo.read`/`seo.update` plus read-only access to content modules.     |
| `CONTENT_MANAGER` | Full pages + blog lifecycle (create/update/delete/publish), `seo.read`. |
| `EDITOR`          | Create/edit (not publish or delete) pages and blog posts.             |

### Permissions

Permissions are `<module>.<action>` strings (`pages.create`,
`seo.update`, ...) stored in the `permissions` table and attached to
roles via `role_permissions` (see the `RolePermission` model) — **not**
hardcoded per role in application code. Granting or revoking access to an
action for a role is a data change (edit `ROLE_PERMISSIONS` in
`prisma/seed.ts` and re-run the seed, or edit `role_permissions` directly),
never a code change at each call site that checks it.

### `lib/rbac.ts` — the three reusable guards

```ts
requireAuth(): Promise<AuthenticatedUser>
```
Resolves the caller from the session cookie via
`services/auth.service.ts#getCurrentUser` — throws `UnauthorizedError`
(401) for every "not a valid, live session" case. Every protected route
goes through this, directly or via one of the two below.

```ts
requireRole(...roles: string[]): Promise<AuthenticatedUser>
```
`requireAuth()` plus a check that the caller's role name is one of
`roles` — throws `ForbiddenError` (403) otherwise. Coarser-grained;
reserved for checks that are genuinely about the role itself (e.g. access
control management), not used by any example endpoint below since all of
them are permission-based.

```ts
requirePermission(permission: string): Promise<AuthenticatedUser>
```
`requireAuth()` plus a check that `permission` is in the caller's
resolved permission set (`AuthenticatedUser.permissions`, built in
`getCurrentUser` from the caller's role's `role_permissions`) — throws
`ForbiddenError` (403) otherwise. This is what every example endpoint
below uses; a route handler is just:

```ts
export async function POST(request: Request) {
  try {
    const user = await requirePermission("pages.create");
    const input = await validateJsonBody(request, createPageSchema);
    const page = await createPageForUser(input, user.id);
    return apiSuccess({ page }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

The permission check runs **before** body validation, on purpose — an
unauthorized caller learns nothing about what a valid payload looks like
(no validation-error details leak ahead of the 403).

### Example permission-gated endpoints

| Endpoint                              | Permission required |
| -------------------------------------- | -------------------- |
| `POST /api/v1/pages`                   | `pages.create`        |
| `PATCH /api/v1/pages/:id`              | `pages.update`        |
| `DELETE /api/v1/pages/:id`             | `pages.delete`        |
| `POST /api/v1/airports`                | `airports.create`     |
| `PATCH /api/v1/airports/:id`           | `airports.update`     |
| `POST /api/v1/airlines`                | `airlines.create`     |
| `POST /api/v1/offers`                  | `offers.create`       |
| `POST /api/v1/blog/:id/publish`        | `blog.publish`        |
| `POST /api/v1/seo`                     | `seo.update`          |

These are thin, real implementations (a validation schema + a
repository/service pair each) meant to exercise the RBAC layer end to
end, not full-featured CRUD for every field these modules will eventually
need — `pages`/`airports` are the only two with an `update` example since
that was enough to prove both the create and update paths through
`requirePermission`.

Verified live end to end for every endpoint above: authenticated with no
permission → 403 `FORBIDDEN` naming the missing permission; no session at
all → 401 `UNAUTHORIZED`; authenticated with the permission → the action
actually succeeds (row created/updated/deleted/published in the real
database). Confirmed with two real accounts — the seeded `ADMIN` user
(has every permission below the access-control ones) and a temporary
`EDITOR` account (has only `pages.create`/`pages.update`/`blog.create`/
`blog.update` and their `.read` counterparts) — showing the same account
succeeds on `pages.create` and is rejected on `pages.delete`,
`airports.create`, `airlines.create`, `offers.create`, `blog.publish`,
and `seo.update` in the same run. Test rows and the temporary account
were deleted afterward.

## Security

A summary of the hardening measures in place — most are documented in
more depth alongside the endpoint they protect, above.

| Layer                        | Where                                    | What it does |
| ----------------------------- | ------------------------------------------ | -------------- |
| Password hashing               | `lib/password.ts`                          | bcrypt, 12 salt rounds |
| Timing-safe login               | `services/auth.service.ts`                 | Always runs a bcrypt compare, even for a nonexistent email (against a dummy hash), so response time can't reveal whether an email is registered |
| No user enumeration             | `services/auth.service.ts`                 | Wrong password, unknown email, and locked account all return the identical response |
| Per-account lockout             | `User.failedLoginAttempts`/`lockedUntil`   | 5 failed attempts locks the account 15 minutes, silently — even the correct password is rejected while locked |
| Per-IP rate limiting            | `lib/rate-limit.ts`                        | 10 login / 5 forgot-password / 10 reset-password / 10 change-password / 30 per RBAC example endpoint (pages, airports, airlines, offers, blog publish, seo) requests per 15 min per source IP, 429 + `Retry-After` |
| Server-side session invalidation | `User.tokenVersion`, `lib/session.ts`     | Logout **and** password reset/change invalidate the token itself, not just the cookie — a copied/replayed token stops working immediately |
| Session cookie hardening        | `app/api/v1/auth/login/route.ts`           | `HttpOnly` (no JS access), `Secure` in production (HTTPS-only), `SameSite=Lax` |
| Secure password reset tokens     | `lib/reset-token.ts`, `PasswordResetToken` | 256-bit random token, only its SHA-256 hash is stored; single-use, 1-hour expiry, and using one invalidates every other outstanding token for that account |
| No secrets in response bodies   | throughout                                 | `passwordHash` never serialized; the session token is delivered only via `Set-Cookie`, never in JSON; the raw reset token is logged server-side only, never returned in an API response |
| Centralized, generic error handling | `lib/handle-error.ts`                  | Every unexpected error returns a generic `INTERNAL_SERVER_ERROR`/`DATABASE_ERROR` — stack traces and internals are logged server-side (`lib/logger.ts`), never returned to the client |
| Request body size cap           | `lib/validation.ts`                        | Rejects declared bodies over 100 KB before parsing (`validateJsonBody`) |
| HTTP security headers            | `next.config.ts`                           | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`, a restrictive `Content-Security-Policy`, and no `X-Powered-By` |
| SQL injection                    | Prisma throughout                          | All queries are parameterized by the ORM; no raw SQL is built from user input anywhere in this codebase |
| Secrets never bundled to the client | `lib/prisma.ts`, `lib/session.ts`, `lib/logger.ts`, etc. | Guarded with the `server-only` package; `DATABASE_URL`/`SESSION_SECRET` are never `NEXT_PUBLIC_`-prefixed |

**What's deliberately not here yet**, since it isn't relevant until there's
more surface area to protect: CSRF tokens (a same-origin JSON API with
`SameSite=Lax` cookies isn't a meaningfully exposed CSRF target the way a
cross-origin form-post flow would be — revisit if a separate frontend
origin is introduced), a shared "require auth" middleware (only one route
is protected so far; `/me` checks itself directly), and a distributed
rate-limit store (see the per-IP limiter's caveats above).

## Data model

Auth/audit tables, CMS content tables, and travel master data — no auth
logic, API routes, or admin UI exist yet, just the schema future work
will read and write.

```
roles ──< role_permissions >── permissions
  │
  └──< users ──< audit_logs
         │
         └──< pages ──< page_sections

services  (standalone — no relations yet)

airlines ──< airline_content   (1:1)
airlines ──< flight_offers ──< flight_offer_segments >── airports
                                       │
                                       └────────────────── airlines

destination_categories ──< destinations
airports ──< routes >── airports

blog_categories ──< blog_posts >── users (author)
blog_posts ──< blog_post_tags >── blog_tags

media ──< reviews
media ──< seo_metadata   (og image / twitter image)
media ──< site_settings   (logo / favicon / default og image)
faqs  (standalone — optionally attached to any entity by type + id)
seo_metadata  (standalone — one record per entity, by type + id)
redirects  (standalone)

navigation ──< navigation_items ──< navigation_items   (self, parent/child)
form_submissions  (standalone)
site_settings  (standalone — expected to be a single row)
```

- **`users`** — `email` unique; `passwordHash` is a bcrypt hash
  (`lib/password.ts`), never plaintext; `roleId` is required, so every
  user has exactly one role. `tokenVersion`, `failedLoginAttempts`, and
  `lockedUntil` back the auth endpoints' session-invalidation and
  account-lockout behavior — see the Security section above.
- **`password_reset_tokens`** — one row per outstanding/used reset
  request. `tokenHash` unique (SHA-256 of the raw token, never the raw
  token itself); `onDelete: Cascade` from `users` — a token has no
  meaning without its user. See `POST /api/v1/auth/forgot-password`
  above for the full flow.
- **`roles`** — `name` unique. Deleting a role that still has users
  attached is blocked at the database level (`ON DELETE RESTRICT`) —
  reassign those users first.
- **`permissions`** — `key` unique, `<module>.<action>` convention (e.g.
  `blog.publish`). Deleting a permission cascades to remove any
  `role_permissions` rows that reference it.
- **`role_permissions`** — join table, composite primary key
  `(roleId, permissionId)`. Deleting a role or permission cascades here.
- **`audit_logs`** — append-only; no `updatedAt`, rows are never modified
  after creation. `userId` is nullable and set to `NULL` (not
  cascade-deleted) if the user is later removed, so the audit trail
  outlives the account it describes. `oldData`/`newData` are JSON
  (nullable — a create has no `oldData`, a delete has no `newData`).
  Indexed on `userId`, `(entityType, entityId)`, and `createdAt` for the
  common access patterns (a user's activity, an entity's history, a
  chronological feed).
- **`pages`** — `slug` unique; `status` is the `ContentStatus` enum
  (`DRAFT` / `PUBLISHED` / `ARCHIVED`, default `DRAFT`). `createdBy`/
  `updatedBy` reference `users` but are nullable with `ON DELETE SET
  NULL` — deleting the authoring user drops the attribution, not the
  page (same pattern as `audit_logs.userId`). `featuredImageId` is a
  plain string, not a foreign key — there's no media/asset model yet.
- **`page_sections`** — a page's content blocks. `pageId` is `ON DELETE
  CASCADE` (a section has no meaning without its parent page). `data` is
  JSON for section-type-specific structured content; `content` is
  freeform body text. Indexed on `(pageId, sortOrder)` for the page's
  ordered section list, and on `sectionType`.
- **`services`** — standalone content entries (e.g. a services listing).
  `slug` unique; `status` uses the same `ContentStatus` enum as `pages`.
  `heroImageId` is a plain string for the same reason as
  `pages.featuredImageId`. No relations yet — none were requested for
  this model.
- **`airports`** — travel reference data. `slug` and `iataCode` are
  required and unique; `icaoCode` is optional but unique when present
  (Postgres unique constraints allow multiple `NULL`s, so airports
  without an ICAO code don't collide with each other). Indexed on
  `city`, `country`, `countryCode`, and `isActive`.
- **`airlines`** — same required+unique `iataCode` / optional+unique
  `icaoCode` pattern as `airports`. `logoId` is a plain string, not a
  foreign key, for the same reason as `pages.featuredImageId`. Indexed
  on `country`, `countryCode`, `isActive`, `isFeatured`, and `sortOrder`
  (the latter two support a "featured airlines" listing).
- **`airline_content`** — long-form editorial content (overview,
  business/first class, lounge, route write-ups) split out from
  `airlines` to keep that table lean. Strictly one-to-one: `airlineId`
  is unique, and the row is `ON DELETE CASCADE`d with its airline since
  it has no meaning on its own.
- **`flight_offers`** — a sellable itinerary. `cabinClass` uses the
  `CabinClass` enum (`ECONOMY` / `PREMIUM_ECONOMY` / `BUSINESS` /
  `FIRST`), shared with `flight_offer_segments`. `price`/`originalPrice`
  are `Decimal(10,2)`, not floats, to avoid rounding error on money.
  `airlineId` keeps the default `ON DELETE RESTRICT` — an airline with
  live offers can't be deleted out from under them. Indexed on
  `airlineId`, `cabinClass`, `isActive`, `featured`, `validFrom`, and
  `validUntil`.
- **`flight_offer_segments`** — one leg of an offer's itinerary.
  `flightOfferId` is `ON DELETE CASCADE` (a segment has no meaning
  without its offer, like `page_sections`/`pages`); `airlineId`,
  `originAirportId`, and `destinationAirportId` keep the default
  `ON DELETE RESTRICT` (can't delete an airline/airport still referenced
  by a segment). No `createdAt`/`updatedAt` — segments are
  created/replaced as a batch with their offer, not edited individually.
  Indexed on `(flightOfferId, sortOrder)` for the offer's ordered
  itinerary, plus `airlineId`, `originAirportId`, `destinationAirportId`,
  and `departureAt`.
- **`destination_categories`** — simple taxonomy for grouping
  destinations (e.g. "Beach", "City Break"). `slug` unique.
- **`destinations`** — a city/region content entry. `slug` unique;
  `categoryId` is nullable with `ON DELETE SET NULL` — deleting a
  category declassifies its destinations rather than deleting them
  (same pattern as `pages.createdBy`). `iataCode` here is a metro/city
  code for display (e.g. `"PAR"`) and is **not** unique, unlike
  `airports.iataCode` — it isn't a primary identifier for this model.
  `heroImageId` is a plain string for the same reason as
  `pages.featuredImageId`. Indexed on `city`, `country`, `countryCode`,
  `region`, `categoryId`, `isFeatured`, and `isActive`.
- **`routes`** — a content page for a specific origin→destination
  airport pair (e.g. a programmatic SEO route page). `slug` unique;
  `originAirportId`/`destinationAirportId` keep the default
  `ON DELETE RESTRICT` — can't delete an airport still referenced by a
  route. `description` is a short summary, `content` is the long-form
  body. Indexed on `(originAirportId, destinationAirportId)` for pair
  lookups, plus `isFeatured` and `isActive`.
- **`blog_categories`** — simple taxonomy for grouping blog posts (e.g.
  "Travel Tips", "Guides"). `slug` unique.
- **`blog_tags`** — freeform post labels, many-to-many via
  `blog_post_tags`. `slug` unique.
- **`blog_posts`** — `slug` unique; `status` reuses the same
  `ContentStatus` enum as `pages`/`services`. `authorId`/`categoryId` are
  nullable with `ON DELETE SET NULL` — deleting the author or category
  drops the attribution/classification, not the post (same pattern as
  `pages.createdBy` and `destinations.categoryId`). `featuredImageId` is a
  plain string for the same reason as `pages.featuredImageId`. Indexed
  on `status`, `categoryId`, `authorId`, and `publishedAt`.
- **`blog_post_tags`** — join table, composite primary key
  `(blogPostId, blogTagId)`. Both sides `ON DELETE CASCADE` — a tag
  assignment has no meaning once either the post or the tag is gone (same
  pattern as `role_permissions`).
- **`media`** — the first real media/asset table. `url` unique — each row
  is one distinct file, not a duplicate pointer to an existing one.
  `width`/`height` are nullable since they only apply to image/video
  assets. Indexed on `mimeType`.
- **`reviews`** — a customer testimonial. `status` uses the new
  `ReviewStatus` enum (`PENDING` / `APPROVED` / `REJECTED`, default
  `PENDING`) — a moderation lifecycle, deliberately distinct from
  `ContentStatus` (editorial draft/published/archived). `rating` isn't
  constrained to 1–5 at the database level; validate that in the future
  service/validation layer. `imageId` is a **real foreign key to
  `media`** (`ON DELETE SET NULL`) — unlike the placeholder image fields
  on earlier models, `Review` and `Media` were introduced in the same
  task, so there was no reason not to wire it up properly. Indexed on
  `status`, `sortOrder`, `rating`, and `imageId`.
- **`faqs`** — a question/answer entry, optionally attached to a specific
  entity via the nullable `entityType` (`FaqEntityType` enum: `PAGE` /
  `DESTINATION` / `SERVICE` / `AIRLINE` / `FLIGHT_OFFER` / `ROUTE` /
  `BLOG_POST`) + `entityId` pair — the same polymorphic-association shape
  as `audit_logs.entityType`/`entityId`, but a closed enum here since the
  set of attachable content types is small and known, rather than
  `audit_logs`' open-ended free string. Leaving both fields `NULL` makes
  a FAQ "general" (unattached). Indexed on
  `(entityType, entityId, sortOrder)` for an entity's ordered FAQ list,
  and on `isActive`.
- **`seo_metadata`** — SEO metadata for one entity, identified
  polymorphically by `entityType` (`SeoEntityType` enum — a separate enum
  from `FaqEntityType`, even though the values currently match, so this
  task didn't need to touch the `Faq` model) + `entityId`. **Both fields
  are required** (unlike `faqs`' nullable pair) — SEO metadata only makes
  sense attached to a specific entity. `@@unique([entityType, entityId])`
  guarantees at most one SEO record per entity. `robotsIndex`/
  `robotsFollow` map to the meta-robots index/follow directives.
  `ogImageId`/`twitterImageId` are real foreign keys to `media` (nullable,
  `ON DELETE SET NULL`) — same reasoning as `reviews.imageId`, since both
  fields are new here and `media` already exists. `schemaData` is the
  JSON-LD payload for `schemaType`. Indexed on `ogImageId` and
  `twitterImageId`.
- **`redirects`** — a URL redirect rule. `sourceUrl` unique — two rules
  can't claim the same incoming path. `statusCode` stores the literal
  HTTP status (301/302/307/308, default `301`) rather than an enum,
  since it's meant to be the exact code a future redirect handler
  responds with; validate it's a real redirect code in the future
  validation layer. Indexed on `isActive` and `destinationUrl` (the
  latter helps find every rule pointing at a given target, e.g. when
  detecting redirect chains).
- **`form_submissions`** — a submitted form (contact, newsletter, quote
  request, etc.). `status` uses the new `FormSubmissionStatus` enum
  (`PENDING` / `PROCESSED` / `SPAM` / `ARCHIVED`, default `PENDING`).
  `formType` stays a free string, not an enum, since new form types are
  expected to appear over time without a migration (same reasoning as
  `pages.pageType`). `payload` (JSON) holds the full submitted data
  regardless of which fields a given form actually has. Indexed on
  `formType`, `status`, `createdAt`, and `email`.
- **`navigation`** — a named menu (e.g. "Main Menu", "Footer Links").
  `location` unique — only one menu can occupy a given placement slot at
  a time. Kept as a free string rather than an enum, same reasoning as
  `pages.pageType`/`pages.template` (layout slots are a content/theme
  concern).
- **`navigation_items`** — one link in a menu. Self-referential
  `parentId` enables nested (dropdown) menus; both `navigationId` and
  `parentId` are `ON DELETE CASCADE` — deleting a menu removes all its
  items, and deleting a parent item removes its children. No
  `createdAt`/`updatedAt` — items are managed as a batch with their menu
  (same reasoning as `flight_offer_segments`). Indexed on
  `(navigationId, sortOrder)` for a menu's ordered item list, plus
  `parentId` and `isActive`.
- **`site_settings`** — global site configuration. Expected to hold a
  single row in practice; enforcing that is a service-layer concern, not
  a schema-level constraint. `logoId`/`faviconId`/`defaultOgImageId` are
  real foreign keys to `media` (same reasoning as `seo_metadata`'s image
  fields — all three fields are new here and `media` already exists).
  `socialLinks` is JSON (e.g. `{ facebook: "...", instagram: "..." }`).

Note: the `featuredImageId`/`heroImageId`/`logoId` placeholder fields on
`pages`/`services`/`airlines`/`destinations` are **not** wired to `media`
— doing so was out of scope for the task that added `media`, which
touched only `faqs`/`reviews`/`media`. They remain plain strings for now.

Permissions are assigned to roles, never directly to users — a user's
effective permissions are just their role's permissions.

### Seed data

`prisma/seed.ts` seeds five roles and a starter catalog of 32 permissions
covering both current infra (users, roles, permissions, audit_logs) and
modules that don't exist yet (pages, seo, airlines, airports, offers,
blog) — so role/permission wiring is already in place the moment each
module lands.

| Role               | Access                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `SUPER_ADMIN`       | Every permission, including managing the roles/permissions catalog.      |
| `ADMIN`             | Every permission except `roles.update` and `permissions.update`.         |
| `SEO_MANAGER`       | SEO read/write; read-only on pages, blog, airlines, airports, offers.    |
| `CONTENT_MANAGER`   | Full pages/blog read, create, update, delete, publish; SEO read.         |
| `EDITOR`            | Pages/blog read, create, update (drafting) only — no publish or delete.  |

The script is fully declarative and safe to re-run: it upserts every role
and permission in the lists above, deletes any permission no longer in
the list (cascading to its `role_permissions` rows), and reconciles each
role's assignments to match exactly — so removing or renaming a
permission key here and re-running the seed cleans up the old one
automatically instead of leaving it orphaned.

The script is idempotent (`upsert` on the unique `name`/`key` fields), so
re-running it — after adding a new permission, for example — won't
duplicate existing rows.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the PostgreSQL database in pgAdmin

1. Open pgAdmin and connect to your PostgreSQL server (create a server
   connection first if you haven't — right-click **Servers** → **Register**
   → **Server**, using the host/port/user/password of your Postgres
   instance).
2. Right-click **Databases** under that server → **Create** → **Database…**.
3. Set **Database**: `multicityexperts` (or any name you prefer), leave
   the owner as your default role, then **Save**.
4. Note the host, port, database name, username, and password you used —
   you'll need them for `DATABASE_URL` in the next step.

### 3. Configure `DATABASE_URL`

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/multicityexperts?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/multicityexperts?schema=public"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SESSION_SECRET="<output of: openssl rand -base64 32>"
```

- `DATABASE_URL` is what Prisma uses at runtime for queries.
- `DIRECT_URL` is a non-pooled connection, used by Prisma for
  introspection/migrations. If you're connecting straight to Postgres
  (no PgBouncer/connection pooler in front of it, which is the normal
  case for a local pgAdmin-managed database), set it to the same value
  as `DATABASE_URL`.
- `NEXT_PUBLIC_SITE_URL` is safe to expose to the browser (hence the
  `NEXT_PUBLIC_` prefix). `DATABASE_URL`, `DIRECT_URL`, and
  `SESSION_SECRET` are **not** prefixed with `NEXT_PUBLIC_`, so Next.js
  never bundles them into client-side code — they're only readable from
  server-side files like `lib/prisma.ts`/`lib/session.ts` (which
  additionally import the `server-only` package as a build-time guard
  against accidental client imports).
- `SESSION_SECRET` signs the login session cookie (`lib/session.ts`).
  Generate a real one with `openssl rand -base64 32` — never reuse the
  same value across environments, and never commit a real value.

### 4. Run Prisma

```bash
npx prisma migrate dev
npx prisma db seed
```

`migrate dev` applies the migrations in `prisma/migrations/` (creating
`users`, `roles`, `permissions`, `role_permissions`, `audit_logs`) and
generates the typed Prisma Client. `db seed` runs `prisma/seed.ts`,
populating the five roles and their permissions described above — safe
to re-run any time.

### 5. Start the development server

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

### 6. Test `/api/v1/health`

```bash
curl http://localhost:3000/api/v1/health
```

Expected response when PostgreSQL is reachable:

```json
{ "success": true, "data": { "status": "ok", "database": "connected" }, "meta": {} }
```

If you get a 503 with `"code": "DATABASE_ERROR"`, double-check that
the database from step 2 exists in pgAdmin, is running, and that
`DATABASE_URL` in `.env` matches its host/port/user/password/database
name exactly.

## What's intentionally not here yet

Per scope, this task does not include: the public website, admin
dashboard, a login UI, generic route-protection middleware (each protected
route — `/me`, `/change-password` — checks itself directly via
`getCurrentUser()`; there's no shared middleware yet for other routes to
reuse the same check), user registration, a real email service (password
reset tokens are logged server-side, not emailed — see
`POST /api/v1/auth/forgot-password` above), any other business API
routes, flight/destination/route search, pricing, or booking logic, SEO
middleware/redirect handling, or form-submission/navigation-rendering
logic. Those will be built on top of this foundation — new resources get
a route handler under `app/api/v1/<resource>/`, a service, a repository,
and a Zod schema, following the pattern above. The complete set of tables
in `prisma/schema.prisma` so far: `users`, `roles`, `permissions`,
`role_permissions`, `audit_logs`, `pages`, `page_sections`, `services`,
`airports`, `airlines`, `airline_content`, `flight_offers`,
`flight_offer_segments`, `destination_categories`, `destinations`,
`routes`, `blog_categories`, `blog_tags`, `blog_posts`, `blog_post_tags`,
`faqs`, `reviews`, `media`, `seo_metadata`, `redirects`,
`form_submissions`, `navigation`, `navigation_items`, `site_settings`,
`password_reset_tokens` — 30 tables in total. Other domain models will be
added alongside their own modules.
