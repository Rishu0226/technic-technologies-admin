const MAX_AGE = 30 * 24 * 60 * 60;

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
  document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
}
