import { cloudinary } from "@/lib/cloudinary";
import { AppError, ErrorCode } from "@/lib/errors";
import { createMedia } from "@/repositories/media.repository";

/** Uploads a file buffer to Cloudinary and records it as a `Media` row.
 * `folder` groups uploads by feature (e.g. "page-sections") so they're
 * browsable in the Cloudinary dashboard, not required by anything here. */
export async function uploadAndCreateMedia(buffer: Buffer, filename: string, mimeType: string, folder = "page-sections") {
  const result = await new Promise<{ secure_url: string; width?: number; height?: number; bytes: number }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(
            new AppError(
              error?.message ?? "Image upload failed",
              502,
              ErrorCode.INTERNAL_SERVER_ERROR,
            ),
          );
          return;
        }
        resolve(uploadResult);
      });
      stream.end(buffer);
    },
  );

  return createMedia({
    filename,
    url: result.secure_url,
    mimeType,
    size: result.bytes,
    width: result.width,
    height: result.height,
  });
}
