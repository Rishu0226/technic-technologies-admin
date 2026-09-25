import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/admin" : "/admin/login", request.url));
  }

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Guard the site root and admin pages. Public files such as /Assest/logo-brand.png
// must stay outside this matcher, or the image optimizer receives the login redirect.
export const config = {
  matcher: ["/", "/admin/:path*"],
};
