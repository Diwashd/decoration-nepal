'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AuthUser } from '@/lib/services/auth';
import type { BrandingSettings } from '@/lib/settings';

interface AdminShellProps {
  user: AuthUser;
  branding: BrandingSettings;
  children: React.ReactNode;
}

export default function AdminShell({ user, branding, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar user={user} logo={branding.logo} logoSizePercent={branding.logoSizePercent} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader user={user} logo={branding.logo} logoSizePercent={branding.logoSizePercent} onMenu={() => setSidebarOpen(true)} />
        <main className="admin-content flex-1 overflow-x-hidden bg-surface-container-low p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
