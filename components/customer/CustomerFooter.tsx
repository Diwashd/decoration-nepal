import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getWhatsAppLink } from '@/lib/utils';

export default function CustomerFooter() {
  return (
    <footer className="w-full bg-surface-container-low pt-20 pb-12 border-t border-outline-variant/20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <span className="font-display text-primary text-2xl font-bold mb-6 block">11:11</span>
            <p className="text-on-surface-variant leading-relaxed text-sm">
              Crafting turnkey event masterpieces in Nepal with meticulous attention to luxury and exclusivity.
            </p>
            <p className="text-on-surface-variant text-xs mt-4">
              Jawalakhel, Lalitpur, Nepal
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Venues', href: '/destinations' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'Plan Event', href: '/planner' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-xs font-bold uppercase tracking-widest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event Types */}
          <div>
            <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Event Types</h4>
            <ul className="space-y-3">
              {['Wedding', 'Anniversary', 'Birthday', 'Pasni', 'Haldi / Mehendi'].map(item => (
                <li key={item}>
                  <Link href="/planner" className="text-on-surface-variant hover:text-primary cursor-pointer transition-colors text-xs font-bold uppercase tracking-widest">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-6">Connect</h4>
            <div className="space-y-3">
              <a href="tel:+9779847411305" className="text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center gap-2">
                📞 +977-9847411305
              </a>
              <a href="mailto:event.eleveneleven@gmail.com" className="text-on-surface-variant hover:text-primary transition-colors text-sm flex items-center gap-2">
                ✉️ event.eleveneleven@gmail.com
              </a>
            </div>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/11byNK" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/11byNK" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-8 text-center text-on-surface-variant text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Eleven 11 Decoration Nepal. All Excellence Reserved.
        </div>
      </div>
    </footer>
  );
}
