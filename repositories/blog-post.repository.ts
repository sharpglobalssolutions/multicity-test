import { prisma } from "@/lib/prisma";

const WITH_RELATIONS = {
  category: true,
  author: true,
  tags: { include: { tag: true } },
} as const;

export function findBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export function publishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
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
