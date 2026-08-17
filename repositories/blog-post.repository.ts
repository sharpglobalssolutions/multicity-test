import { prisma } from "@/lib/prisma";

export function findBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export function publishBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}
