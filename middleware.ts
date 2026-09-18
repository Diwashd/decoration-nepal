import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/admin'];
const authRoutes = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for login page and API routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if user has admin session cookie
  const sessionCookie = request.cookies.get('admin-session');

  // Validate cookie exists and looks like valid JSON
  const isValidSession = !!sessionCookie
    && sessionCookie.value.length > 10
    && sessionCookie.value.startsWith('{');

  if (!isValidSession && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Clear invalid cookie if it exists
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    if (sessionCookie) {
      response.cookies.delete('admin-session');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
