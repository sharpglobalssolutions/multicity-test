import { apiSuccess } from "@/lib/api-response";
import { RateLimitError, ValidationError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { requirePermission } from "@/lib/rbac";
import { uploadAndCreateMedia } from "@/services/media.service";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 20;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
// A background/hero video needs far more headroom than a still image —
// even a well-compressed few-seconds loop easily runs 20-40MB.
const MAX_VIDEO_SIZE_BYTES = 60 * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const ALLOWED_VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

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

    const isVideo = ALLOWED_VIDEO_MIME_TYPES.includes(file.type);
    const isImage = ALLOWED_IMAGE_MIME_TYPES.includes(file.type);
    if (!isVideo && !isImage) {
      throw new ValidationError("Unsupported file type", [
        {
          field: "file",
          message: "Only JPEG, PNG, WebP, GIF, AVIF images or MP4, WebM, MOV videos are supported",
        },
      ]);
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    if (file.size > maxSize) {
      throw new ValidationError("File too large", [
        {
          field: "file",
          message: isVideo ? "Videos must be 60MB or smaller" : "Images must be 8MB or smaller",
        },
      ]);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const media = await uploadAndCreateMedia(buffer, file.name, file.type);

    return apiSuccess({ media }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
