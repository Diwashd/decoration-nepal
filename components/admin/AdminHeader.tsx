'use client';

import { logoutAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { AuthUser } from '@/lib/services/auth';
import { Bell, LogOut, Menu } from 'lucide-react';

interface AdminHeaderProps {
  user: AuthUser;
  logo: string;
  logoSizePercent: number;
  onMenu: () => void;
}

export default function AdminHeader({ user, logo, logoSizePercent, onMenu }: AdminHeaderProps) {
  const router = useRouter();
  const headerHeight = Math.max(64, Math.round(36 * logoSizePercent / 100) + 24);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container px-3 sm:px-6"
      style={{ height: `${headerHeight}px` }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenu} aria-label="Open navigation" aria-controls="admin-navigation" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="11:11 Decoration Nepal" className="w-auto max-w-36 object-contain" style={{ height: `${Math.round(36 * logoSizePercent / 100)}px` }} />
          <h1 className="truncate text-base font-bold font-display text-cream-contrast sm:text-xl">11:11 Decoration Nepal</h1>
          <span className="hidden text-sm text-on-surface-variant sm:block">Operations Console</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button aria-label="Notifications" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface">
          <Bell className="w-5 h-5" />
        </button>

        <div className="h-8 w-px bg-outline-variant"></div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden text-right sm:block">
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
