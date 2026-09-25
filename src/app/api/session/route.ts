import { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 24 * 60 * 60,
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = body?.token;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", token, cookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("token", "", { ...cookieOptions, maxAge: 0 });
  return response;
}
