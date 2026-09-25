import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  // Extract token from cookies
  const token = request.cookies.get('token')?.value;

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isExpired = request.nextUrl.searchParams.get('expired') === 'true';
  
  if (!token && !isLoginPage) {
    // If user is not authenticated and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (token && isLoginPage && !isExpired) {
    // If user is authenticated and trying to access login, redirect to dashboard
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Only guard admin pages. Public files such as /Assest/logo-brand.png
// must stay outside this matcher, or the image optimizer receives the login redirect.
export const config = {
  matcher: ["/admin/:path*"],
};
