# validations/

Zod schemas for request input (body, query params, route params) used by
route handlers, plus the TypeScript types inferred from them
(`z.infer<typeof schema>`).

Convention: one file per resource, e.g. `flight.validation.ts`, exporting
schemas named for the operation they validate (`createFlightSchema`,
`listFlightsQuerySchema`, ...).

Route handlers run these schemas through the generic helpers in
`lib/validation.ts` (`validateJsonBody`, `validateSearchParams`,
`validateParams`) rather than calling `schema.parse()`/`safeParse()`
directly — that's what guarantees a validation failure always throws the
same `ValidationError` and produces the same API error shape.

No schemas exist yet — this directory is scaffolding for future work.
