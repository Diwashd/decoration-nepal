'use client';

import { useEffect, useState } from 'react';
import CustomerNav from '@/components/customer/CustomerNav';
import CustomerFooter from '@/components/customer/CustomerFooter';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import MobileBottomNav from '@/components/customer/MobileBottomNav';
import type { BrandingSettings } from '@/lib/settings';

const defaultBranding: BrandingSettings = {
  logo: '',
  favicon: '/favicon.ico',
  ogImage: '/og-image.jpg',
  logoSizePercent: 100,
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);

  useEffect(() => {
    const loadBranding = async () => {
      const response = await fetch('/api/admin/settings', { cache: 'no-store' });
      const result = await response.json();
      if (response.ok && result.success && result.branding) {
        setBranding({ ...defaultBranding, ...result.branding });
      }
    };

    void loadBranding();
  }, []);

  const logoHeight = Math.round(48 * branding.logoSizePercent / 100);
  const navbarHeight = Math.max(80, logoHeight + 32);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNav branding={branding} />
      <div className="bg-surface" style={{ paddingTop: `${navbarHeight}px` }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-3">
          <Breadcrumbs />
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <CustomerFooter />
      <MobileBottomNav />
      <div className="h-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 md:hidden" aria-hidden="true" />
    </div>
  );
}
