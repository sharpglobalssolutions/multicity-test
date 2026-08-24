import { z } from "zod";

/** Query params for `GET /destinations`. `type` selects which public list
 * to return — there's no single "list all destinations" shape a footer
 * link column could use directly, since Top Countries is a distinct-value
 * rollup and Top Cities is per-destination. */
export const listDestinationsQuerySchema = z.object({
  type: z.enum(["country", "city"]),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type ListDestinationsQuery = z.infer<typeof listDestinationsQuerySchema>;
