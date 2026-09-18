import { cookies } from 'next/headers';
import { AuthUser } from './auth';

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Create session for authenticated user
 */
export async function createSession(user: AuthUser): Promise<void> {
  const sessionData = JSON.stringify(user);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get current session user
 */
export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const user = JSON.parse(sessionCookie.value) as AuthUser;
    return user;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

/**
 * Destroy user session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Require authentication - use in Server Components
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getSession();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

/**
 * Require specific role
 */
export async function requireRole(allowedRoles: string[]): Promise<AuthUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}
