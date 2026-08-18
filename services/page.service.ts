import type { Prisma } from "@prisma/client";
import { recordAuditLog } from "@/lib/audit";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { isRecordNotFoundError, isUniqueConstraintError } from "@/lib/prisma-errors";
import {
  createPage,
  deletePage,
  findPageById,
  findPageBySlug,
  listPages,
  publishPage,
  unpublishPage,
  updatePage,
} from "@/repositories/page.repository";
import type { AuthenticatedUser } from "@/services/auth.service";
import type { CreatePageInput, ListPagesQuery, UpdatePageInput } from "@/validations/page.validation";

const ENTITY_TYPE = "Page";

export async function createPageForUser(input: CreatePageInput, userId: string, ip: string) {
  let page;
  try {
    page = await createPage(input, userId);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A page with this slug already exists");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "CREATE",
    entityType: ENTITY_TYPE,
    entityId: page.id,
    newData: page,
    ipAddress: ip,
  });

  return page;
}

export async function updatePageForUser(id: string, input: UpdatePageInput, userId: string, ip: string) {
  const before = await findPageById(id);
  if (!before) {
    throw new NotFoundError("Page not found");
  }

  let page;
  try {
    page = await updatePage(id, input, userId);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page not found");
    }
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A page with this slug already exists");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "UPDATE",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: page,
    ipAddress: ip,
  });

  return page;
}

export async function deletePageById(id: string, userId: string, ip: string) {
  const before = await findPageById(id);
  if (!before) {
    throw new NotFoundError("Page not found");
  }

  try {
    await deletePage(id);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page not found");
    }
    throw error;
  }

  await recordAuditLog({
    userId,
    action: "DELETE",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    ipAddress: ip,
  });
}

export async function publishPageById(id: string, userId: string, ip: string) {
  const before = await findPageById(id);
  if (!before) {
    throw new NotFoundError("Page not found");
  }

  const page = await publishPage(id, userId);

  await recordAuditLog({
    userId,
    action: "PUBLISH",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: page,
    ipAddress: ip,
  });

  return page;
}

export async function unpublishPageById(id: string, userId: string, ip: string) {
  const before = await findPageById(id);
  if (!before) {
    throw new NotFoundError("Page not found");
  }

  const page = await unpublishPage(id, userId);

  await recordAuditLog({
    userId,
    action: "UNPUBLISH",
    entityType: ENTITY_TYPE,
    entityId: id,
    oldData: before,
    newData: page,
    ipAddress: ip,
  });

  return page;
}

/** True once a caller holds `pages.read` — the only viewers allowed to see
 * non-published pages (drafts/archived) or filter by an arbitrary status. */
function canViewAllStatuses(viewer: AuthenticatedUser | null): boolean {
  return Boolean(viewer?.permissions.includes("pages.read"));
}

export async function listPagesForViewer(query: ListPagesQuery, viewer: AuthenticatedUser | null) {
  const canViewAll = canViewAllStatuses(viewer);
  // A viewer without `pages.read` can only ever see published pages —
  // their requested `status` filter (if any) is ignored, not honored,
  // so an unauthenticated caller can't use the filter to enumerate drafts.
  const statusFilter = canViewAll ? query.status : "PUBLISHED";

  const where: Prisma.PageWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { slug: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const { items, total } = await listPages({
    where,
    orderBy: { [query.sortBy]: query.sortOrder },
    skip: (query.page - 1) * query.limit,
    take: query.limit,
  });

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.limit),
    },
  };
}

/** Detail lookup by slug. A viewer without `pages.read` gets `NotFoundError`
 * (not `ForbiddenError`) for a non-published page — same enumeration
 * reasoning as auth's generic "invalid email or password": don't confirm a
 * draft page exists at all to someone who can't read it. */
export async function getPageBySlugForViewer(slug: string, viewer: AuthenticatedUser | null) {
  const page = await findPageBySlug(slug);
  if (!page || (page.status !== "PUBLISHED" && !canViewAllStatuses(viewer))) {
    throw new NotFoundError("Page not found");
  }
  return page;
}
