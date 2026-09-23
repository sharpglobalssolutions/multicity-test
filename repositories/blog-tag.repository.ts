import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

/** Same "resolve or create by name" approach as `blog-category.repository.ts`
 * — there's no separate tag-management admin screen, the blog post form
 * just takes a list of tag names. */
export async function findOrCreateBlogTagsByNames(names: string[]) {
  const tags = [];
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    tags.push(await prisma.blogTag.upsert({ where: { slug }, update: {}, create: { name, slug } }));
  }
  return tags;
}

/** Replaces a post's entire tag list in one go — simpler and less error-
 * prone than diffing old vs. new tag ids for a rarely-large list. */
export async function setBlogPostTags(blogPostId: string, tagIds: string[]) {
  await prisma.blogPostTag.deleteMany({ where: { blogPostId } });
  if (tagIds.length > 0) {
    await prisma.blogPostTag.createMany({
      data: tagIds.map((blogTagId) => ({ blogPostId, blogTagId })),
      skipDuplicates: true,
    });
  }
}
