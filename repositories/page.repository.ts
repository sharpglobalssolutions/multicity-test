import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreatePageInput, UpdatePageInput } from "@/validations/page.validation";

export function createPage(input: CreatePageInput, userId: string) {
  return prisma.page.create({
    data: { ...input, createdBy: userId, updatedBy: userId },
  });
}

export function updatePage(id: string, input: UpdatePageInput, userId: string) {
  return prisma.page.update({
    where: { id },
    data: { ...input, updatedBy: userId },
  });
}

export function deletePage(id: string) {
  return prisma.page.delete({ where: { id } });
}

export function findPageById(id: string) {
  return prisma.page.findUnique({ where: { id } });
}

export function findPageBySlug(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

interface ListPagesParams {
  where: Prisma.PageWhereInput;
  orderBy: Prisma.PageOrderByWithRelationInput;
  skip: number;
  take: number;
}

export async function listPages({ where, orderBy, skip, take }: ListPagesParams) {
  const [items, total] = await Promise.all([
    prisma.page.findMany({ where, orderBy, skip, take }),
    prisma.page.count({ where }),
  ]);
  return { items, total };
}

export function publishPage(id: string, userId: string) {
  return prisma.page.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date(), updatedBy: userId },
  });
}

export function unpublishPage(id: string, userId: string) {
  return prisma.page.update({
    where: { id },
    data: { status: "DRAFT", publishedAt: null, updatedBy: userId },
  });
}
