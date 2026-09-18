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
  Warehouse,
  DollarSign,
  UserCircle,
  BarChart3,
  Settings,
  Search,
  PenTool,
  MapPin,
  Star,
  ImageIcon
} from 'lucide-react';
import { AuthUser } from '@/lib/services/auth';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  user: AuthUser;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Leads', href: '/admin/leads', icon: Users },
    { name: 'Quotations', href: '/admin/quotations', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: UserCircle },
    { name: 'Packages', href: '/admin/packages', icon: Package },
    { name: 'Services', href: '/admin/services', icon: Wrench },
    { name: 'Destinations', href: '/admin/destinations', icon: MapPin },
    { name: 'Featured Venues', href: '/admin/destinations/featured', icon: Star },
    { name: 'Payments', href: '/admin/payments', icon: DollarSign },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Blog', href: '/admin/blog', icon: PenTool },
    { name: 'SEO', href: '/admin/seo', icon: Search },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-surface">
      <div className="flex items-center justify-center h-16 bg-surface-container-low border-b border-outline-variant">
        <span className="text-2xl font-extrabold font-display text-primary">11:11</span>
        <span className="ml-2 text-sm font-semibold text-on-surface">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded text-sm font-medium transition',
                isActive
                  ? 'bg-primary text-surface'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 bg-surface-container-low border-t border-outline-variant">
        <div className="text-xs text-on-surface-variant">Logged in as</div>
        <div className="text-sm font-semibold text-on-surface truncate">{user.name}</div>
        <div className="text-xs text-on-surface-variant truncate">{user.email}</div>
        <div className="mt-1 text-xs text-primary font-medium">{user.role}</div>
      </div>
    </div>
  );
}
