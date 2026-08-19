import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreatePageSectionInput, UpdatePageSectionInput } from "@/validations/page-section.validation";

/** Zod validates `data` as `Record<string, unknown>` (a plain object) —
 * structurally JSON-safe at runtime, but not assignable to Prisma's
 * `InputJsonValue` type without a cast, since `unknown` values aren't
 * statically provable as JSON-safe the way `Prisma.InputJsonValue`'s
 * recursive union requires. */
function toInputJson(data: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  return data === undefined ? undefined : (data as Prisma.InputJsonValue);
}

export function findSectionById(id: string) {
  return prisma.pageSection.findUnique({ where: { id } });
}

export function findSectionsByPageId(pageId: string) {
  return prisma.pageSection.findMany({ where: { pageId }, orderBy: { sortOrder: "asc" } });
}

/** One past the current highest `sortOrder` for `pageId` — where a newly
 * created section lands when the caller doesn't specify a position. */
export async function getNextSortOrder(pageId: string): Promise<number> {
  const last = await prisma.pageSection.findFirst({
    where: { pageId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
}

export function createSection(pageId: string, input: CreatePageSectionInput & { sortOrder: number }) {
  return prisma.pageSection.create({
    data: { ...input, data: toInputJson(input.data), pageId },
  });
}

export function updateSection(id: string, input: UpdatePageSectionInput) {
  return prisma.pageSection.update({
    where: { id },
    data: { ...input, data: toInputJson(input.data) },
  });
}

export function deleteSection(id: string) {
  return prisma.pageSection.delete({ where: { id } });
}

/** Applies every `sortOrder` change atomically — a partial reorder (some
 * sections moved, others not, because of a mid-batch failure) would leave
 * the page's section order inconsistent. */
export function reorderSections(updates: { id: string; sortOrder: number }[]) {
  return prisma.$transaction(
    updates.map(({ id, sortOrder }) => prisma.pageSection.update({ where: { id }, data: { sortOrder } })),
  );
}
