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
