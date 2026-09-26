const MAX_AGE = 30 * 24 * 60 * 60;

export function apiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/+$/, "");
}

export function readAdminToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function saveAdminToken(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `token=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearAdminToken() {
  const expired = "Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `token=; ${expired}; SameSite=Lax`;
  document.cookie = `token=; ${expired}; SameSite=Lax; Secure`;
}
