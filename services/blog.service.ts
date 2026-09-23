import type { BlogCategory, BlogPost, BlogPostTag, BlogTag, Prisma, User } from "@prisma/client";
import { recordAuditLog } from "@/lib/audit";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { isRecordNotFoundError, isUniqueConstraintError } from "@/lib/prisma-errors";
import { revalidateBlogPostBySlug } from "@/lib/revalidate";
import { findActiveFaqsByEntity } from "@/repositories/faq.repository";
import { findOrCreateBlogCategoryByName, listBlogCategories } from "@/repositories/blog-category.repository";
import {
  createBlogPost,
  deleteBlogPost,
  findBlogPostById,
  findBlogPostByIdWithRelations,
  findBlogPostBySlugWithRelations,
  findPublishedBlogPostBySlug,
  findRelatedPublishedPosts,
  listBlogPosts,
  listPublishedBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  updateBlogPost,
} from "@/repositories/blog-post.repository";
import { findOrCreateBlogTagsByNames, setBlogPostTags } from "@/repositories/blog-tag.repository";
import { findByEntityWithImages } from "@/repositories/seo-metadata.repository";
import type { AuthenticatedUser } from "@/services/auth.service";
import type { CreateBlogPostInput, ListBlogPostsQuery, UpdateBlogPostInput } from "@/validations/blog.validation";

const ENTITY_TYPE = "BlogPost";

type BlogPostWithRelations = BlogPost & {
  category?: BlogCategory | null;
  author?: User | null;
  tags?: (BlogPostTag & { tag: BlogTag })[];
};

/**
 * The shape any public-facing consumer sees — API responses and server
 * components that call this service directly both go through this mapper,
 * so there's one definition of "what a blog post looks like on the
 * outside" (no internal fields like authorId/categoryId, and the article
 * URL is derived from the slug since BlogPost has no `url` column).
 * `category`/`author`/`tags` are only populated when the caller's query
 * included those relations (only `findPublishedBlogPostBySlug` does) —
 * `listPublishedBlogPosts`-backed callers get `null`/`[]` for these.
 */
export function toPublicBlogPost(post: BlogPostWithRelations) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featuredImageId,
    url: `/insights/${post.slug}`,
    published_at: post.publishedAt,
    updated_at: post.updatedAt,
    reading_time: post.readingTime,
    category: post.category ? { name: post.category.name, slug: post.category.slug } : null,
    author_name: post.author?.name ?? null,
    tags: post.tags?.map((postTag) => postTag.tag.name) ?? [],
  };
}

export type PublicBlogPost = ReturnType<typeof toPublicBlogPost>;

export async function listFeaturedBlogPosts(limit?: number): Promise<PublicBlogPost[]> {
  const posts = await listPublishedBlogPosts(limit);
  return posts.map(toPublicBlogPost);
}

/** Lightweight lookup — just the post itself, for `generateMetadata` (which
 * only needs title/excerpt/id and shouldn't pay for related-posts/FAQ
 * queries too). */
export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost> {
  const post = await findPublishedBlogPostBySlug(slug);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }
  return toPublicBlogPost(post);
}

/**
 * Everything the blog detail page's body needs, in one fetch of the raw
 * post — avoids re-querying just to recover `categoryId` for the related-
 * posts lookup (which the public `PublicBlogPost` shape deliberately
 * doesn't expose). `relatedPosts`/`faqs` never throw on their own; an
 * empty result just means that section doesn't render.
 */
export async function getBlogPostPageData(slug: string) {
  const post = await findPublishedBlogPostBySlug(slug);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }

  const [relatedPosts, faqs] = await Promise.all([
    findRelatedPublishedPosts(post.id, post.categoryId, 3),
    findActiveFaqsByEntity("BLOG_POST", post.id),
  ]);

  return {
    post: toPublicBlogPost(post),
    relatedPosts: relatedPosts.map((related) => toPublicBlogPost(related)),
    faqs,
  };
}

/** SEO metadata for one blog post (`SeoMetadata.entityType === "BLOG_POST"`),
 * with `ogImage`/`twitterImage` resolved to real URLs — for
 * `generateMetadata`. Returns `null` if no override was ever saved for
 * this post; the caller falls back to the post's own title/excerpt/
 * featured image, same "never break the page" pattern as
 * `getHomePageSeoSafely`. */
export async function getBlogPostSeo(postId: string) {
  return findByEntityWithImages("BLOG_POST", postId);
}

// ---------------------------------------------------------------------
// Admin CRUD — everything below mirrors services/page.service.ts's
// pattern (fetch "before" state, mutate, audit log, revalidate).
// ---------------------------------------------------------------------

/** True once a caller holds `blog.read` — the only viewers allowed to see
 * non-published posts (drafts/archived) or filter by an arbitrary status.
 * Mirrors `page.service.ts`'s `canViewAllStatuses`. */
function canViewAllStatuses(viewer: AuthenticatedUser | null): boolean {
  return Boolean(viewer?.permissions.includes("blog.read"));
}

/** Detail lookup by id *or* slug — tries `id` first (what the admin edit
 * form has), then falls back to `slug` (what a public caller has). A
 * viewer without `blog.read` gets `NotFoundError` (not `ForbiddenError`)
 * for a non-published post — same enumeration reasoning as
 * `getPageByIdOrSlugForViewer`. */
export async function getBlogPostByIdOrSlugForViewer(idOrSlug: string, viewer: AuthenticatedUser | null) {
  const post = (await findBlogPostByIdWithRelations(idOrSlug)) ?? (await findBlogPostBySlugWithRelations(idOrSlug));
  if (!post || (post.status !== "PUBLISHED" && !canViewAllStatuses(viewer))) {
    throw new NotFoundError("Blog post not found");
  }
  return toPublicBlogPost(post);
}

export async function listBlogCategoriesForAdmin() {
  return listBlogCategories();
}

export async function listBlogPostsForAdmin(query: ListBlogPostsQuery) {
  const where: Prisma.BlogPostWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { slug: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const { items, total } = await listBlogPosts({
    where,
    orderBy: { [query.sortBy]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  return {
    items: items.map(toPublicBlogPost),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

/** Resolves `category`/`tags` (plain names) to real ids, upserting rows
 * that don't exist yet — see `repositories/blog-category.repository.ts`. */
async function resolveCategoryAndTags(input: { category?: string; tags?: string[] }) {
  const categoryId = input.category ? (await findOrCreateBlogCategoryByName(input.category)).id : null;
  const tagIds = input.tags && input.tags.length > 0 ? (await findOrCreateBlogTagsByNames(input.tags)).map((t) => t.id) : null;
  return { categoryId, tagIds };
}

export async function createBlogPostForUser(input: CreateBlogPostInput, userId: string, ip: string) {
  const { categoryId, tagIds } = await resolveCategoryAndTags(input);

  let post;
  try {
    post = await createBlogPost({ ...input, categoryId, authorId: userId });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A blog post with this slug already exists");
    }
    throw error;
  }

  if (tagIds) {
    await setBlogPostTags(post.id, tagIds);
  }

  await recordAuditLog({ userId, action: "CREATE", entityType: ENTITY_TYPE, entityId: post.id, newData: post, ipAddress: ip });
  revalidateBlogPostBySlug(post.slug);

  const withRelations = await findBlogPostByIdWithRelations(post.id);
  return toPublicBlogPost(withRelations!);
}

export async function updateBlogPostForUser(id: string, input: UpdateBlogPostInput, userId: string, ip: string) {
  const before = await findBlogPostById(id);
  if (!before) {
    throw new NotFoundError("Blog post not found");
  }

  const { categoryId, tagIds } = await resolveCategoryAndTags(input);

  let post;
  try {
    post = await updateBlogPost(id, { ...input, ...(input.category !== undefined ? { categoryId } : {}) });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Blog post not found");
    }
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A blog post with this slug already exists");
    }
    throw error;
  }

  if (tagIds) {
    await setBlogPostTags(id, tagIds);
  }

  await recordAuditLog({
    userId,
    action: "UPDATE",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: post,
    ipAddress: ip,
  });

  revalidateBlogPostBySlug(post.slug, before.slug);

  const withRelations = await findBlogPostByIdWithRelations(id);
  return toPublicBlogPost(withRelations!);
}

export async function deleteBlogPostById(id: string, userId: string, ip: string) {
  const before = await findBlogPostById(id);
  if (!before) {
    throw new NotFoundError("Blog post not found");
  }

  try {
    await deleteBlogPost(id);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Blog post not found");
    }
    throw error;
  }

  await recordAuditLog({ userId, action: "DELETE", entityType: ENTITY_TYPE, entityId: id, oldData: before, ipAddress: ip });
  revalidateBlogPostBySlug(before.slug);
}

export async function publishExistingBlogPost(id: string, userId: string, ip: string) {
  const before = await findBlogPostById(id);
  if (!before) {
    throw new NotFoundError("Blog post not found");
  }

  const post = await publishBlogPost(id);

  await recordAuditLog({
    userId,
    action: "PUBLISH",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: post,
    ipAddress: ip,
  });
  revalidateBlogPostBySlug(post.slug);

  const withRelations = await findBlogPostByIdWithRelations(id);
  return toPublicBlogPost(withRelations!);
}

export async function unpublishBlogPostById(id: string, userId: string, ip: string) {
  const before = await findBlogPostById(id);
  if (!before) {
    throw new NotFoundError("Blog post not found");
  }

  const post = await unpublishBlogPost(id);

  await recordAuditLog({
    userId,
    action: "UNPUBLISH",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: post,
    ipAddress: ip,
  });
  revalidateBlogPostBySlug(post.slug);

  const withRelations = await findBlogPostByIdWithRelations(id);
  return toPublicBlogPost(withRelations!);
}
