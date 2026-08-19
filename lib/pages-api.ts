/**
 * Thin client-side fetch wrapper over the Pages CMS API — meant to be
 * called from client components (uses relative URLs resolved against the
 * browser's origin, and relies on the browser sending the session cookie
 * automatically for same-origin requests).
 */
import type { ContentStatus, Page } from "@prisma/client";
import type { ApiErrorDetail, ApiMeta, ApiResponse } from "@/types/api";
import type { CreatePageInput, UpdatePageInput } from "@/validations/page.validation";

/** Thrown for any non-success API response — carries the same code/message/
 * field-details shape the server sends, so callers can show a generic
 * message or map `details` onto specific form fields as needed. */
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details: ApiErrorDetail[] = [],
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<{ data: T; meta: ApiMeta }> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!body || !body.success) {
    const error = body && !body.success ? body.error : null;
    throw new ApiRequestError(
      error?.message ?? "Something went wrong. Please try again.",
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.details ?? [],
    );
  }

  return { data: body.data, meta: body.meta };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListPagesParams {
  page: number;
  limit: number;
  search?: string;
  status?: ContentStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "publishedAt";
  sortOrder?: "asc" | "desc";
}

export interface ListPagesResult {
  pages: Page[];
  pagination: PaginationMeta;
}

export async function fetchPages(params: ListPagesParams): Promise<ListPagesResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const { data, meta } = await request<{ pages: Page[] }>(`/api/v1/pages?${searchParams.toString()}`);
  return { pages: data.pages, pagination: meta.pagination as PaginationMeta };
}

export async function fetchPageById(id: string): Promise<Page> {
  const { data } = await request<{ page: Page }>(`/api/v1/pages/${encodeURIComponent(id)}`);
  return data.page;
}

export async function createPage(input: CreatePageInput): Promise<Page> {
  const { data } = await request<{ page: Page }>("/api/v1/pages", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.page;
}

export async function updatePage(id: string, input: UpdatePageInput): Promise<Page> {
  const { data } = await request<{ page: Page }>(`/api/v1/pages/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data.page;
}

export async function deletePage(id: string): Promise<void> {
  await request<{ message: string }>(`/api/v1/pages/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function publishPage(id: string): Promise<Page> {
  const { data } = await request<{ page: Page }>(`/api/v1/pages/${encodeURIComponent(id)}/publish`, {
    method: "POST",
  });
  return data.page;
}

export async function unpublishPage(id: string): Promise<Page> {
  const { data } = await request<{ page: Page }>(`/api/v1/pages/${encodeURIComponent(id)}/unpublish`, {
    method: "POST",
  });
  return data.page;
}
