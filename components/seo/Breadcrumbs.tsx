'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Map path segments to readable labels
const segmentLabels: Record<string, string> = {
  '': 'Home',
  about: 'About Us',
  services: 'Services',
  contact: 'Contact',
  planner: 'Event Planner',
  'my-events': 'My Events',
  admin: 'Admin',
  leads: 'Leads',
  quotations: 'Quotations',
  events: 'Events',
  packages: 'Packages',
  inventory: 'Inventory',
  payments: 'Payments',
  reports: 'Reports',
  seo: 'SEO Settings',
  settings: 'Settings',
  login: 'Login',
  new: 'New',
  'wedding-decoration': 'Wedding Decoration',
  'birthday-decoration': 'Birthday Decoration',
  'anniversary-decoration': 'Anniversary Decoration',
  'pasni-decoration': 'Pasni Decoration',
  'haldi-decoration': 'Haldi Decoration',
  'mehendi-decoration': 'Mehendi Decoration',
  'engagement-decoration': 'Engagement Decoration',
  'proposal-setup': 'Proposal Setup',
  'baby-shower-decoration': 'Baby Shower Decoration',
  'corporate-event-decoration': 'Corporate Event Decoration',
};

function formatSegment(segment: string): string {
  if (segmentLabels[segment]) return segmentLabels[segment];
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;
  if (segments[0] === 'admin' && segments.length === 1) return null;

  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Skip IDs (UUIDs or numeric IDs)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}/.test(segment) || /^\d+$/.test(segment)) {
      return;
    }

    items.push({
      label: formatSegment(segment),
      href: currentPath,
    });
  });

  // Generate JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://decorationnepal.com${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-on-surface-variant overflow-x-auto pb-1"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.href} className="flex items-center gap-1.5 whitespace-nowrap">
              {index > 0 && <ChevronRight className="w-3 h-3 text-outline-variant flex-shrink-0" />}
              {isLast ? (
                <span className="text-primary font-semibold">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {index === 0 ? (
                    <Home className="w-3.5 h-3.5" />
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
