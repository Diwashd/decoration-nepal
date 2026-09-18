import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services',
  description:
    'Complete event solutions in Nepal — decoration, venue finding, photography, makeup, catering, band baja, DJ lights, car decoration, sound systems. Your one-stop event solution.',
  keywords: [
    'decoration services nepal', 'wedding decoration nepal', 'venue finding nepal',
    'event catering nepal', 'makeup artist kathmandu', 'band baja nepal',
    'dj lights nepal', 'car decoration nepal', 'sound system nepal',
  ],
  openGraph: {
    title: 'Our Services | 11:11 Decoration Nepal',
    description:
      'Complete event solutions — decoration, venue finding, photography, makeup, catering, and more.',
    url: 'https://decorationnepal.com/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
