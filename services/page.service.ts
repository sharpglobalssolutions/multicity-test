import { ConflictError, NotFoundError } from "@/lib/errors";
import { isRecordNotFoundError, isUniqueConstraintError } from "@/lib/prisma-errors";
import { createPage, deletePage, updatePage } from "@/repositories/page.repository";
import type { CreatePageInput, UpdatePageInput } from "@/validations/page.validation";

export async function createPageForUser(input: CreatePageInput, userId: string) {
  try {
    return await createPage(input, userId);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A page with this slug already exists");
    }
    throw error;
  }
}

export async function updatePageForUser(id: string, input: UpdatePageInput, userId: string) {
  try {
    return await updatePage(id, input, userId);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page not found");
    }
    if (isUniqueConstraintError(error)) {
      throw new ConflictError("A page with this slug already exists");
    }
    throw error;
  }
}

export async function deletePageById(id: string) {
  try {
    await deletePage(id);
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw new NotFoundError("Page not found");
    }
    throw error;
  }
}
