import Link from 'next/link';
import Image from 'next/image';

export default function CustomerNav() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-outline-variant/30">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-20 flex items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-4">
          <span className="font-display text-primary hidden lg:block tracking-widest uppercase text-lg">Eleven 11</span>
          <span className="font-display text-primary text-xl font-bold lg:hidden">11:11</span>
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
