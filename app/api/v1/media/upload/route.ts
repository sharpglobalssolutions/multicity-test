import { apiSuccess } from "@/lib/api-response";
import { RateLimitError, ValidationError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { uploadAndCreateMedia } from "@/services/media.service";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 20;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`media:upload:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      throw new RateLimitError("Too many requests. Please try again later.", retryAfterSeconds);
    }

    await requirePermission("media.create");

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      throw new ValidationError("A file is required", [{ field: "file", message: "A file is required" }]);
    }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new ValidationError("Unsupported file type", [
        { field: "file", message: "Only JPEG, PNG, WebP, GIF, and AVIF images are supported" },
      ]);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ValidationError("File too large", [{ field: "file", message: "Images must be 8MB or smaller" }]);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await uploadAndCreateMedia(buffer, file.name, file.type);

    return apiSuccess({ media }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
