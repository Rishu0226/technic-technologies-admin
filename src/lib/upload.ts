import { readAdminToken } from "./session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function uploadImage(file: File, folder: "blogs" | "products" | "services" | "media") {
  const body = new FormData();
  body.append("image", file);
  body.append("folder", folder);

  const token = readAdminToken();
  const response = await fetch(`${API_BASE}/api/admin/upload`, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "Image upload failed.");
  }

  return data as { url: string; publicId: string; id: string };
}
