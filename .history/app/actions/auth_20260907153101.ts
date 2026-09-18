'use server';

import { authenticateUser } from '@/lib/services/auth';
import { createSession } from '@/lib/services/session';

export async function loginAction(credentials: { email: string; password: string }) {
  try {
    const user = await authenticateUser(credentials);

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    await createSession(user);

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Authentication service is unavailable. Please try again later.',
    };
  }
}

export async function logoutAction() {
  const { destroySession } = await import('@/lib/services/session');
  await destroySession();
  return { success: true };
}
