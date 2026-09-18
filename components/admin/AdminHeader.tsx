'use client';

import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/lib/services/auth';
import { Bell, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  user: AuthUser;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-surface-container border-b border-outline-variant flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold font-display text-cream-contrast">11:11 Decoration Nepal</h1>
        <span className="text-sm text-on-surface-variant">Operations Console</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded transition">
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-outline-variant"></div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-on-surface">{user.name}</div>
            <div className="text-xs text-on-surface-variant">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
