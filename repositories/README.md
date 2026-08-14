# repositories/

Data access layer. Each repository (e.g. `flight.repository.ts`) wraps
Prisma queries for one domain entity and is the only place in the codebase
that should import `lib/prisma.ts` directly.

Repositories return plain data (or throw `lib/errors.ts` errors such as
`NotFoundError`) — they hold no business rules, only persistence logic.
Services call repositories, never the other way around.

No repositories exist yet — this directory is scaffolding for future work.
