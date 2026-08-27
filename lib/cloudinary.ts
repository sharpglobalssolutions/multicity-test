import { v2 as cloudinary } from "cloudinary";

/** Configures the Cloudinary SDK from env vars — signed, server-side
 * uploads only, so the API secret never reaches the browser. Requires
 * `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
 * in `.env` (free tier at cloudinary.com provides all three); uploads
 * throw a clear error if any is missing rather than failing silently. */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };
