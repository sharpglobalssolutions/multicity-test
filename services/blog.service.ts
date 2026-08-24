import type { BlogPost } from "@prisma/client";
import { NotFoundError } from "@/lib/errors";
import {
  findBlogPostById,
  findPublishedBlogPostBySlug,
  listPublishedBlogPosts,
  publishBlogPost,
} from "@/repositories/blog-post.repository";

export async function publishExistingBlogPost(id: string) {
  const post = await findBlogPostById(id);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }
  return publishBlogPost(id);
}

/**
 * The shape any public-facing consumer sees — API responses and server
 * components that call this service directly both go through this mapper,
 * so there's one definition of "what a blog post looks like on the
 * outside" (no internal fields like authorId/categoryId, and the article
 * URL is derived from the slug since BlogPost has no `url` column).
 */
export function toPublicBlogPost(post: BlogPost) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featuredImageId,
    url: `/insights/${post.slug}`,
    published_at: post.publishedAt,
  };
}

export type PublicBlogPost = ReturnType<typeof toPublicBlogPost>;

export async function listFeaturedBlogPosts(limit?: number): Promise<PublicBlogPost[]> {
  const posts = await listPublishedBlogPosts(limit);
  return posts.map(toPublicBlogPost);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<PublicBlogPost> {
  const post = await findPublishedBlogPostBySlug(slug);
  if (!post) {
    throw new NotFoundError("Blog post not found");
  }
  return toPublicBlogPost(post);
}
