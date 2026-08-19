import { recordAuditLog } from "@/lib/audit";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { isRecordNotFoundError } from "@/lib/prisma-errors";
import {
  createSection,
  deleteSection,
  findSectionById,
  findSectionsByPageId,
  getNextSortOrder,
  reorderSections,
  updateSection,
} from "@/repositories/page-section.repository";
import { findPageById } from "@/repositories/page.repository";
import type {
  CreatePageSectionInput,
  ReorderPageSectionsInput,
  UpdatePageSectionInput,
} from "@/validations/page-section.validation";

const ENTITY_TYPE = "PageSection";

async function getPageOr404(pageId: string) {
  const page = await findPageById(pageId);
  if (!page) {
    throw new NotFoundError("Page not found");
  }
  return page;
}

/** Fetches a section and confirms it belongs to `pageId`. A section that
 * exists but belongs to a *different* page is treated identically to one
 * that doesn't exist at all — this is what "sections belong to the
 * correct page" means in practice: a mismatched (pageId, sectionId) pair
 * from the URL can never read or act on another page's content, and the
 * error gives no hint that the section exists elsewhere. */
async function getOwnedSectionOr404(pageId: string, sectionId: string) {
  const section = await findSectionById(sectionId);
  if (!section || section.pageId !== pageId) {
    throw new NotFoundError("Page section not found");
  }
  return section;
}

export async function createSectionForPage(
  pageId: string,
  input: CreatePageSectionInput,
  userId: string,
  ip: string,
) {
  await getPageOr404(pageId);

  const sortOrder = input.sortOrder ?? (await getNextSortOrder(pageId));
  const section = await createSection(pageId, { ...input, sortOrder });

  await recordAuditLog({
    userId,
    action: "CREATE",
    entityType: ENTITY_TYPE,
    entityId: section.id,
    newData: section,
    ipAddress: ip,
  });

  return section;
}

export async function updateSectionForPage(
  pageId: string,
  sectionId: string,
  input: UpdatePageSectionInput,
  userId: string,
  ip: string,
) {
  const before = await getOwnedSectionOr404(pageId, sectionId);

  let section;
  try {
    section = await updateSection(sectionId, input);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page section not found");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "UPDATE",
    entityType: ENTITY_TYPE,
    entityId: sectionId,
    oldData: before,
    newData: section,
    ipAddress: ip,
  });

  return section;
}

export async function deleteSectionForPage(pageId: string, sectionId: string, userId: string, ip: string) {
  const before = await getOwnedSectionOr404(pageId, sectionId);

  try {
    await deleteSection(sectionId);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page section not found");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "DELETE",
    entityType: ENTITY_TYPE,
    entityId: sectionId,
    oldData: before,
    ipAddress: ip,
  });
}

export async function reorderSectionsForPage(
  pageId: string,
  input: ReorderPageSectionsInput,
  userId: string,
  ip: string,
) {
  await getPageOr404(pageId);

  const existing = await findSectionsByPageId(pageId);
  const existingIds = new Set(existing.map((section) => section.id));
  const requestedIds = new Set(input.sectionIds);

  const isExactMatch =
    existingIds.size === requestedIds.size && [...existingIds].every((id) => requestedIds.has(id));
  if (!isExactMatch) {
    throw new ValidationError("sectionIds must include every section belonging to this page, exactly once");
  }

  const before = existing.map((section) => ({ id: section.id, sortOrder: section.sortOrder }));
  const after = input.sectionIds.map((id, index) => ({ id, sortOrder: index }));

  await reorderSections(after);

  await recordAuditLog({
    userId,
    action: "REORDER",
    entityType: ENTITY_TYPE,
    entityId: pageId,
    oldData: before,
    newData: after,
    ipAddress: ip,
  });

  return findSectionsByPageId(pageId);
}
