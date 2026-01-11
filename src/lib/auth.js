import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

/**
 * Check if user is authenticated (server-side)
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return !!session?.value;
}

/**
 * Set admin session cookie
 * @param {string} userId - Admin user ID
 */
export async function setSession(userId) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

/**
 * Clear admin session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current session
 * @returns {Promise<string|null>}
 */
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}
