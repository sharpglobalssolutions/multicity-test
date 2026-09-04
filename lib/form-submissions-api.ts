/**
 * Thin client-side fetch wrapper over the admin Form Submissions API —
 * same conventions as `lib/pages-api.ts` (relative URLs, session cookie
 * sent automatically, `ApiRequestError` on any non-success response).
 */
import type { FormSubmission, FormSubmissionStatus } from "@prisma/client";
import type { ApiErrorDetail, ApiMeta, ApiResponse } from "@/types/api";

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

export interface ListFormSubmissionsParams {
  page: number;
  limit: number;
  search?: string;
  status?: FormSubmissionStatus;
  formType?: string;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface ListFormSubmissionsResult {
  submissions: FormSubmission[];
  pagination: PaginationMeta;
}

export async function fetchFormSubmissions(params: ListFormSubmissionsParams): Promise<ListFormSubmissionsResult> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.formType) searchParams.set("formType", params.formType);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const { data, meta } = await request<{ submissions: FormSubmission[] }>(
    `/api/v1/form-submissions?${searchParams.toString()}`,
  );
  return { submissions: data.submissions, pagination: meta.pagination as PaginationMeta };
}

export async function fetchFormSubmissionById(id: string): Promise<FormSubmission> {
  const { data } = await request<{ submission: FormSubmission }>(
    `/api/v1/form-submissions/${encodeURIComponent(id)}`,
  );
  return data.submission;
}

export async function updateFormSubmissionStatus(
  id: string,
  status: FormSubmissionStatus,
): Promise<FormSubmission> {
  const { data } = await request<{ submission: FormSubmission }>(
    `/api/v1/form-submissions/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify({ status }) },
  );
  return data.submission;
}
