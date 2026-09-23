/**
 * Thin client-side fetch wrapper over the Blog CMS API — meant to be
 * called from client components (uses relative URLs resolved against the
 * browser's origin, and relies on the browser sending the session cookie
 * automatically for same-origin requests). Mirrors `lib/pages-api.ts`'s
 * exact shape.
 */
import type { BlogCategory, ContentStatus } from "@prisma/client";
import type { ApiErrorDetail, ApiMeta, ApiResponse } from "@/types/api";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "@/validations/blog.validation";
import type { PublicBlogPost } from "@/services/blog.service";

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

export interface ListBlogPostsParams {
  page: number;
  limit: number;
  search?: string;
  status?: ContentStatus;
  sortBy?: "createdAt" | "updatedAt" | "title" | "publishedAt";
  sortOrder?: "asc" | "desc";
}

export interface ListBlogPostsResult {
  posts: PublicBlogPost[];
  pagination: PaginationMeta;
}

export async function fetchBlogPosts(params: ListBlogPostsParams): Promise<ListBlogPostsResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const { data, meta } = await request<{ posts: PublicBlogPost[] }>(`/api/v1/blog/admin?${searchParams.toString()}`);
  return { posts: data.posts, pagination: meta.pagination as PaginationMeta };
}

export async function fetchBlogPostById(id: string): Promise<PublicBlogPost> {
  const { data } = await request<{ post: PublicBlogPost }>(`/api/v1/blog/${encodeURIComponent(id)}`);
  return data.post;
}

export async function createBlogPost(input: CreateBlogPostInput): Promise<PublicBlogPost> {
  const { data } = await request<{ post: PublicBlogPost }>("/api/v1/blog", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.post;
}

export async function updateBlogPost(id: string, input: UpdateBlogPostInput): Promise<PublicBlogPost> {
  const { data } = await request<{ post: PublicBlogPost }>(`/api/v1/blog/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data.post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await request<{ message: string }>(`/api/v1/blog/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function publishBlogPost(id: string): Promise<PublicBlogPost> {
  const { data } = await request<{ post: PublicBlogPost }>(`/api/v1/blog/${encodeURIComponent(id)}/publish`, {
    method: "POST",
  });
  return data.post;
}

export async function unpublishBlogPost(id: string): Promise<PublicBlogPost> {
  const { data } = await request<{ post: PublicBlogPost }>(`/api/v1/blog/${encodeURIComponent(id)}/unpublish`, {
    method: "POST",
  });
  return data.post;
}

// --- Categories (read-only from the admin form's perspective — see
// repositories/blog-category.repository.ts for why there's no create/
// update/delete here) ---

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await request<{ categories: BlogCategory[] }>("/api/v1/blog/categories");
  return data.categories;
}

// --- Media (identical to lib/pages-api.ts's uploadMedia) ---

export interface UploadedMedia {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
}

export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/v1/media/upload", { method: "POST", body: formData });
  const body = (await response.json().catch(() => null)) as ApiResponse<{ media: UploadedMedia }> | null;

  if (!body || !body.success) {
    const error = body && !body.success ? body.error : null;
    throw new ApiRequestError(
      error?.message ?? "Upload failed. Please try again.",
      response.status,
      error?.code ?? "UNKNOWN_ERROR",
      error?.details ?? [],
    );
  }

  return body.data.media;
}
