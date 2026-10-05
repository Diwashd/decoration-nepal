import { getSession } from '@/lib/services/session';
import { cookies } from 'next/headers';
import AdminShell from '@/components/admin/AdminShell';
import { getBrandingSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  // No user = middleware already redirected or we're on /admin/login
  // Just render children directly — no redirect from layout
  if (!user) {
    // Clear invalid cookie if present
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    if (sessionCookie) {
      cookieStore.delete('admin-session');
    }
    return <>{children}</>;
  }

  const branding = await getBrandingSettings();
  return <AdminShell user={user} branding={branding}>{children}</AdminShell>;
}
