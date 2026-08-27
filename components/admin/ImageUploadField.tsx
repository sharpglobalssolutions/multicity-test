"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiRequestError, uploadMedia } from "@/lib/pages-api";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

/** Shows the current image (if any) as a thumbnail, a file picker that
 * uploads straight to Cloudinary (via `POST /api/v1/media/upload`) and
 * fills the field with the returned URL, and a plain URL input as a
 * fallback for pointing at an already-hosted image without re-uploading. */
export function ImageUploadField({ value, onChange, disabled }: ImageUploadFieldProps) {
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
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative h-28 w-full overflow-hidden rounded-lg bg-muted">
          <Image src={value} alt="" fill sizes="320px" className="object-cover" unoptimized />
        </div>
      ) : null}

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste an image URL, or upload one"
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
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
