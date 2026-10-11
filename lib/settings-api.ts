/**
 * Thin client-side fetch wrapper over the site-settings API — same shape
 * as `lib/pages-api.ts`'s `request` helper, kept as its own small file
 * since settings aren't a sub-resource of pages.
 */
import type { SiteSettings } from "@prisma/client";
import type { ApiErrorDetail, ApiResponse } from "@/types/api";
import type { UpdateSiteSettingsInput } from "@/validations/site-settings.validation";

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

async function request<T>(input: string, init?: RequestInit): Promise<T> {
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

  return body.data;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const data = await request<{ settings: SiteSettings | null }>("/api/v1/settings");
  return data.settings;
}

export async function updateSiteSettings(input: UpdateSiteSettingsInput): Promise<SiteSettings> {
  const data = await request<{ settings: SiteSettings }>("/api/v1/settings", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  return data.settings;
}
