import { getSession } from '@/lib/services/session';
import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

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

  return (
    <div className="flex h-screen bg-surface">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-surface-container-low p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
