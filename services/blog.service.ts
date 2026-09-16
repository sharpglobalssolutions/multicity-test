import type { BlogCategory, BlogPost, BlogPostTag, BlogTag, User } from "@prisma/client";
import { findActiveFaqsByEntity } from "@/repositories/faq.repository";
import {
  findBlogPostById,
  findPublishedBlogPostBySlug,
  findRelatedPublishedPosts,
  listPublishedBlogPosts,
  publishBlogPost,
} from "@/repositories/blog-post.repository";
import { findByEntityWithImages } from "@/repositories/seo-metadata.repository";
import { NotFoundError } from "@/lib/errors";

export async function publishExistingBlogPost(id: string) {
  const post = await findBlogPostById(id);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }
  return publishBlogPost(id);
}

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
