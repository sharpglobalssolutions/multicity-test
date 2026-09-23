import { ContentStatus } from "@prisma/client";
import { z } from "zod";

/** Query params for `GET /blog`. No `limit` means "return every published
 * post" (used by the full /insights listing page); the homepage section
 * passes a small limit for its featured grid. */
export const listPublishedBlogPostsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export type ListPublishedBlogPostsQuery = z.infer<typeof listPublishedBlogPostsQuerySchema>;

/** Blog posts aren't top-level routes (they render at `/insights/[slug]`,
 * not `/[slug]`), so there's no reserved-slug collision risk the way
 * `validations/page.validation.ts`'s `RESERVED_SLUGS` guards against —
 * just the same lowercase-hyphenated format. */
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric words separated by hyphens");

/** `category`/`tags` are plain names, not ids — the service layer resolves
 * each to an existing `BlogCategory`/`BlogTag` row (matched by slug) or
 * creates it, since there's no separate category/tag management screen
 * yet (see `repositories/blog-category.repository.ts`). */
export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: slugSchema,
  excerpt: z.string().trim().max(300, "Keep the excerpt under 300 characters").optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().trim().optional(),
  category: z.string().trim().max(60).optional(),
  tags: z.array(z.string().trim().min(1)).max(20).optional(),
  readingTime: z.coerce.number().int().min(1).max(180).optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;

/** Every field optional — a PATCH updates only what's supplied — but at
 * least one must be present. No `status` field here on purpose, same
 * reasoning as `updatePageSchema`: lifecycle transitions go only through
 * the dedicated `POST /blog/:id/publish` and `/unpublish` endpoints,
 * gated behind `blog.publish` specifically, so a caller with only
 * `blog.update` (e.g. the EDITOR role) can't sneak a publish through PATCH. */
export const updateBlogPostSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    slug: slugSchema.optional(),
    excerpt: z.string().trim().max(300, "Keep the excerpt under 300 characters").optional(),
    content: z.string().min(1, "Content is required").optional(),
    featuredImage: z.string().trim().optional(),
    category: z.string().trim().max(60).optional(),
    tags: z.array(z.string().trim().min(1)).max(20).optional(),
    readingTime: z.coerce.number().int().min(1).max(180).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;

/** Query params for the admin `GET /blog/admin` list — mirrors
 * `listPagesQuerySchema` exactly. */
export const listBlogPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "publishedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ListBlogPostsQuery = z.infer<typeof listBlogPostsQuerySchema>;
