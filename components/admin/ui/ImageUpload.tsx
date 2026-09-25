"use client";

import React, { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadImage } from "../../../src/lib/upload";

type Folder = "blogs" | "products" | "services" | "media";

export default function ImageUpload({
  label,
  value,
  folder,
  accept = "image/jpeg,image/png,image/webp,image/gif",
  onChange,
}: {
  label: string;
  value?: string;
  folder: Folder;
  accept?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange(uploaded.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="tn-label">{label}</label>
      <div className="flex items-start gap-4">
        {value && accept.startsWith("video/") ? (
          <video src={value} className="h-24 w-36 rounded-xl border border-technic-border bg-technic-bg" controls />
        ) : value ? (
          <img src={value} alt="" className="h-24 w-36 rounded-xl border border-technic-border object-cover bg-technic-bg" />
        ) : (
          <div className="h-24 w-36 rounded-xl border border-dashed border-technic-border bg-technic-bg" />
        )}
        <div className="flex-1">
          <label className="inline-flex items-center gap-2 rounded-xl border border-technic-border bg-white px-4 py-2.5 text-sm font-medium text-technic-text cursor-pointer hover:border-technic-cyan">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4 text-technic-cyan-deep" />}
            {uploading ? "Uploading..." : accept.startsWith("video/") ? "Upload video" : "Upload image"}
            <input type="file" accept={accept} className="sr-only" onChange={onFile} disabled={uploading} />
          </label>
          {value && <p className="mt-2 break-all text-xs text-technic-muted">{value}</p>}
          {error && <p className="mt-2 text-sm text-technic-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
