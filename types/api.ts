/**
 * Shared response envelope used by every route under app/api/v1.
 * Keeping success and error responses structurally distinct lets
 * consumers narrow on `success` instead of checking for undefined fields.
 */

export interface ApiMeta {
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details: ApiErrorDetail[];
}

export interface ApiError {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
