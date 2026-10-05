'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, House, MapPin, Sparkles } from 'lucide-react';

const navigationItems = [
  { href: '/', label: 'Home', icon: House },
  { href: '/services', label: 'Services', icon: Sparkles },
  { href: '/destinations', label: 'Venues', icon: MapPin },
  { href: '/planner', label: 'Book Now', icon: CalendarCheck },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/40 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.18)] backdrop-blur-xl md:hidden"
    >
      <div className="grid h-16 grid-cols-4">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
