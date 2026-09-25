"use client";

import React, { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { ApiClient } from "../../../../lib/api";
import ImageUpload from "../../../../../components/admin/ui/ImageUpload";

type MediaItem = {
  _id: string;
  filename: string;
  url: string;
  createdAt: string;
};

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    try {
      const response = await ApiClient.get<MediaItem[]>("/api/admin/media");
      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load uploaded images.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyPath = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-technic-text font-heading flex items-center">
          <ImageIcon className="w-8 h-8 mr-3 text-technic-cyan-deep" />
          Media Library
        </h1>
      </div>

      <div className="bg-white border border-technic-border rounded-2xl shadow-tn-md p-6 mb-8">
        <ImageUpload
          label="Upload an image"
          folder="media"
          onChange={() => {
            load();
          }}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-technic-error/20 bg-technic-error-soft p-4 text-technic-error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-technic-muted">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => copyPath(item.url)}
              className="overflow-hidden rounded-2xl border border-technic-border bg-white text-left shadow-tn-sm hover:border-technic-cyan"
            >
              <img src={item.url} alt={item.filename} className="h-36 w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-sm font-medium text-technic-text">{item.filename}</p>
                <p className="mt-1 text-xs text-technic-cyan-deep">
                  {copied === item.url ? "Path copied" : "Copy image path"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
