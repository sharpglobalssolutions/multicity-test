import { z } from "zod";

/** Query params for `GET /blog`. No `limit` means "return every published
 * post" (used by the full /insights listing page); the homepage section
 * passes a small limit for its featured grid. */
export const listPublishedBlogPostsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type ListPublishedBlogPostsQuery = z.infer<typeof listPublishedBlogPostsQuerySchema>;
