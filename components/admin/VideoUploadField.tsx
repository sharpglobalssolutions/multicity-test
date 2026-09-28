"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError, uploadMedia } from "@/lib/pages-api";

interface VideoUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

/** Same shape as `ImageUploadField` (thumbnail/preview, upload button,
 * plain-URL fallback), for a background video field — e.g. the homepage
 * Hero's optional video, which falls back to its image when this is
 * empty (see `components/Hero.tsx`). Uploads straight to Cloudinary via
 * `POST /api/v1/media/upload`, same as images; the route tells video and
 * image uploads apart by mime type. */
export function VideoUploadField({ value, onChange, disabled }: VideoUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const media = await uploadMedia(file);
      onChange(media.url);
      toast.success("Video uploaded.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <video src={value} muted loop playsInline controls className="h-28 w-full rounded-lg bg-muted object-cover" />
      ) : null}

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste a video URL, or upload one — leave empty to use the image instead"
          disabled={disabled || uploading}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          Upload
        </Button>
        {value ? (
          <Button type="button" variant="outline" size="sm" disabled={disabled || uploading} onClick={() => onChange("")}>
            Clear
          </Button>
        ) : null}
      </div>
      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
