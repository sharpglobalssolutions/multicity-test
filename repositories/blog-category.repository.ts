import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

/** There's no admin screen for managing categories as their own resource
 * yet — the blog post form just takes a category name and this resolves
 * it to an existing row (matched by slug, so "Business Class" and
 * "business class" collapse to one) or creates it on the fly. */
export function findOrCreateBlogCategoryByName(name: string) {
  const slug = slugify(name);
  return prisma.blogCategory.upsert({
    where: { slug },
    update: {},
    create: { name, slug },
  });
}

export function listBlogCategories() {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
}
