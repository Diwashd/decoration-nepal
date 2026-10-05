'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Package,
  Wrench,
  DollarSign,
  UserCircle,
  BarChart3,
  Settings,
  Search,
  PenTool,
  MapPin,
  ImageIcon,
  X,
} from 'lucide-react';
import { AuthUser } from '@/lib/services/auth';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  user: AuthUser;
  logo: string;
  logoSizePercent: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ user, logo, logoSizePercent, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const logoAreaHeight = Math.max(64, Math.round(36 * logoSizePercent / 100) + 24);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Quotations', href: '/admin/quotations', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: UserCircle },
    { name: 'Packages', href: '/admin/packages', icon: Package },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Blog', href: '/admin/blog', icon: PenTool },
    { name: 'SEO', href: '/admin/seo', icon: Search },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col bg-surface shadow-2xl transition-transform duration-200 md:static md:z-auto md:w-64 md:translate-x-0 md:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )} id="admin-navigation">
        <div
          className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 md:justify-center"
          style={{ height: `${logoAreaHeight}px` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="11:11 Decoration Nepal" className="w-auto max-w-32 object-contain" style={{ height: `${Math.round(36 * logoSizePercent / 100)}px` }} />
          <span className="ml-2 text-sm font-semibold text-on-surface">Admin</span>
          <button type="button" onClick={onClose} aria-label="Close navigation" className="ml-auto rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex min-h-11 items-center space-x-3 rounded px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-primary text-surface'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                )}
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant bg-surface-container-low p-4">
          <div className="text-xs text-on-surface-variant">Logged in as</div>
          <div className="truncate text-sm font-semibold text-on-surface">{user.name}</div>
          <div className="truncate text-xs text-on-surface-variant">{user.email}</div>
          <div className="mt-1 text-xs font-medium text-primary">{user.role}</div>
        </div>
      </aside>
    </>
  );
}
