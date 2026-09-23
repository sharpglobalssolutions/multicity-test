import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "@/validations/blog.validation";

const WITH_RELATIONS = {
  category: true,
  author: true,
  tags: { include: { tag: true } },
} as const;

export function findBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

/** Admin-facing lookup — any status, with relations, for the edit form and
 * the admin detail view. `findPublishedBlogPostBySlug` (below) stays
 * separate and untouched since it's also relied on for the public-facing
 * "must be published" guarantee. */
export function findBlogPostByIdWithRelations(id: string) {
  return prisma.blogPost.findUnique({ where: { id }, include: WITH_RELATIONS });
}

/** Same id-or-slug shape as `findPageById`/`findPageBySlug` feeding
 * `getPageByIdOrSlugForViewer` — lets one admin API route serve both the
 * admin edit form (has the real id) and any slug-based caller, with
 * visibility (draft/archived vs. published-only) decided by the service
 * layer, not here. */
export function findBlogPostBySlugWithRelations(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug }, include: WITH_RELATIONS });
}

export function createBlogPost(input: CreateBlogPostInput & { categoryId: string | null; authorId: string | null }) {
  return prisma.blogPost.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImageId: input.featuredImage,
      categoryId: input.categoryId,
      authorId: input.authorId,
      readingTime: input.readingTime,
    },
  });
}

// Prisma's `update` treats an `undefined` field value as "leave this field
// alone" (not "set it to undefined"), so a PATCH that omits a field simply
// never touches it — no manual per-field undefined-guards needed here.
export function updateBlogPost(
  id: string,
  input: UpdateBlogPostInput & { categoryId?: string | null; authorId?: string | null },
) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      featuredImageId: input.featuredImage,
      categoryId: input.categoryId,
      readingTime: input.readingTime,
    },
  });
}

export function deleteBlogPost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}

export function publishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export function unpublishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "DRAFT", publishedAt: null },
  });
}

interface ListBlogPostsParams {
  where: Prisma.BlogPostWhereInput;
  orderBy: Prisma.BlogPostOrderByWithRelationInput;
  skip: number;
  take: number;
}

/** Admin list — every status, unlike `listPublishedBlogPosts` below. */
export async function listBlogPosts({ where, orderBy, skip, take }: ListBlogPostsParams) {
  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({ where, orderBy, skip, take, include: WITH_RELATIONS }),
    prisma.blogPost.count({ where }),
  ]);
  return { items, total };
}

export function listPublishedBlogPosts(limit?: number) {
  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
}

export function findPublishedBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED" }, include: WITH_RELATIONS });
}

/** Related posts for a blog detail page's sidebar — same category first
 * (when the post has one), falling back to the most recent other
 * published posts so the section always has something to show rather
 * than being empty for uncategorized content. */
export async function findRelatedPublishedPosts(
  excludePostId: string,
  categoryId: string | null,
  limit: number,
) {
  if (categoryId) {
    const sameCategory = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", categoryId, id: { not: excludePostId } },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    if (sameCategory.length >= limit) return sameCategory;

    const remainder = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", id: { notIn: [excludePostId, ...sameCategory.map((post) => post.id)] } },
      orderBy: { publishedAt: "desc" },
      take: limit - sameCategory.length,
    });
    return [...sameCategory, ...remainder];
  }

  return prisma.blogPost.findMany({
    where: { status: "PUBLISHED", id: { not: excludePostId } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
