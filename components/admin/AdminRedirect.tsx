'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if we're already on the login page
    if (pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  // If on login page, don't render anything — let the login page render
  if (pathname === '/admin/login') {
    return null;
  }

  return (
    <div className="flex h-screen bg-surface items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-on-surface-variant text-sm">Redirecting to login...</p>
      </div>
    </div>
  );
}
