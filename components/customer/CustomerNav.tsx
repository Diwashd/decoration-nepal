'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BrandingSettings } from '@/lib/settings';

export default function CustomerNav({ branding }: { branding: BrandingSettings }) {
  const logoHeight = Math.round(48 * branding.logoSizePercent / 100);
  const navbarHeight = Math.max(80, logoHeight + 32);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header
      className="fixed top-0 z-50 w-full bg-background/90 backdrop-blur-xl border-b border-outline-variant/30"
      style={{ height: `${navbarHeight}px` }}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-8 px-6 py-4 lg:px-20">
        <Link href="/" className="flex items-center gap-4">
          {!logoLoaded || logoFailed ? (
            <span
              className="font-display font-bold tracking-widest text-primary"
              style={{ fontSize: `${Math.max(20, Math.round(24 * branding.logoSizePercent / 100))}px` }}
            >
              11:11
            </span>
          ) : null}
          {branding.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={branding.logo}
              alt="11:11 Decoration Nepal"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoFailed(true)}
              className={`h-auto max-h-full w-auto max-w-48 object-contain ${logoLoaded && !logoFailed ? '' : 'absolute h-0 w-0 opacity-0'}`}
              style={{ height: `${logoHeight}px` }}
            />
          ) : null}
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-primary font-bold transition-colors uppercase text-sm tracking-widest">
            Home
          </Link>
          <Link href="/services" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            Services
          </Link>
          <Link href="/destinations" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            Venues
          </Link>
          <Link href="/gallery" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            Gallery
          </Link>
          <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            About Us
          </Link>
          <Link href="/blog" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            Blog
          </Link>
          <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors uppercase text-sm tracking-widest font-semibold">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/planner"
            className="hidden sm:block bg-primary text-on-primary text-sm font-semibold px-6 py-3 rounded-full hover:bg-primary-fixed-dim transition-all shadow-lg uppercase tracking-wider"
          >
            Book Now
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
            <span className="text-on-primary text-sm font-bold">👤</span>
          </div>
        </div>
      </div>
    </header>
  );
}
