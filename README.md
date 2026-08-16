# MultiCityExperts — Backend Foundation

This repository currently contains **only the backend foundation** for
MultiCityExperts: a Next.js API layer, Prisma/PostgreSQL wiring, and the
folder structure future features (flights, airports, airlines, offers,
blog, CMS, admin dashboard, public site, authentication, SEO) will be
built into. None of those features exist yet — this is intentionally
infrastructure-only.

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
    route.ts        GET /api/v1/health — verifies DB connectivity

lib/               Framework-agnostic infrastructure
  prisma.ts          Prisma client singleton (server-only)
  api-response.ts    apiSuccess() / apiError() response builders
  errors.ts          ErrorCode enum + AppError and its typed subclasses
  handle-error.ts    Converts thrown errors into a consistent API response
  validation.ts      Reusable Zod helpers (validateJsonBody, etc.)
  logger.ts          Minimal structured (JSON line) logger, server-only

services/          Business logic (empty — scaffolding only)
repositories/       Data access via Prisma (empty — scaffolding only)
validations/        Zod request schemas (empty — scaffolding only)
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

| Method | Path             | Description                                  |
| ------ | ---------------- | --------------------------------------------- |
| GET    | `/api/v1/health` | Liveness check — verifies the API can reach PostgreSQL |

`GET /api/v1/health` runs `SELECT 1` through Prisma. On success:

```json
{ "success": true, "data": { "status": "ok", "database": "connected" }, "meta": {} }
```

If the database is unreachable, it returns HTTP 503 with
`error.code: "DATABASE_ERROR"` instead of throwing.

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
```

- **`users`** — `email` unique; `passwordHash` stores a hash, never a
  plaintext password (nothing hashes/verifies it yet — that's auth logic,
  out of scope for this task); `roleId` is required, so every user has
  exactly one role.
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
```

- `DATABASE_URL` is what Prisma uses at runtime for queries.
- `DIRECT_URL` is a non-pooled connection, used by Prisma for
  introspection/migrations. If you're connecting straight to Postgres
  (no PgBouncer/connection pooler in front of it, which is the normal
  case for a local pgAdmin-managed database), set it to the same value
  as `DATABASE_URL`.
- `NEXT_PUBLIC_SITE_URL` is safe to expose to the browser (hence the
  `NEXT_PUBLIC_` prefix). `DATABASE_URL` and `DIRECT_URL` are **not**
  prefixed with `NEXT_PUBLIC_`, so Next.js never bundles them into
  client-side code — they're only readable from server-side files like
  `lib/prisma.ts` (which additionally imports the `server-only` package
  as a build-time guard against accidental client imports).

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
dashboard, authentication (login, sessions, password hashing/verification,
middleware/guards), any API routes or admin UI, flight/destination/route
search, pricing, or booking logic, or SEO. Those will be built on top of
this foundation — new resources get a route handler under
`app/api/v1/<resource>/`, a service, a repository, and a Zod schema,
following the pattern above. Only the `users`/`roles`/`permissions`/
`role_permissions`/`audit_logs`/`pages`/`page_sections`/`services`/
`airports`/`airlines`/`airline_content`/`flight_offers`/
`flight_offer_segments`/`destination_categories`/`destinations`/`routes`/
`blog_categories`/`blog_tags`/`blog_posts`/`blog_post_tags` tables exist
in `prisma/schema.prisma` so far; other domain models will be added
alongside their own modules.
