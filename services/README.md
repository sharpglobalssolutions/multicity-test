# services/

Business logic layer. Each service is a plain TypeScript module (e.g.
`flight.service.ts`) that orchestrates one or more repositories, applies
domain rules, and is called from route handlers in `app/api/v1/`.

Services must not import `next/server` or touch the request/response
directly — that keeps them testable in isolation and reusable outside
of HTTP (e.g. from a cron job or script).

No services exist yet — this directory is scaffolding for future work.
