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

  // Validate the cookie before protected routes try to read the session.
  let isValidSession = false;
  if (sessionCookie?.value) {
    try {
      const parsed: unknown = JSON.parse(sessionCookie.value);
      isValidSession = typeof parsed === 'object'
        && parsed !== null
        && typeof (parsed as { id?: unknown }).id === 'string'
        && typeof (parsed as { name?: unknown }).name === 'string'
        && typeof (parsed as { email?: unknown }).email === 'string'
        && typeof (parsed as { role?: unknown }).role === 'string';
    } catch {
      isValidSession = false;
    }
  }

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
