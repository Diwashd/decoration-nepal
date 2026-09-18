import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Welcome to Eleven Eleven (11:11) — a premier decorations and event management company in Nepal. Sister company to Naulo Koseli (NK). Over 500 events completed across Kathmandu, Pokhara, and Chitwan.',
  keywords: [
    'about eleven eleven nepal', 'event management company nepal',
    'naulo koseli', 'decoration company kathmandu', '11:11 decoration nepal',
  ],
  openGraph: {
    title: 'About Us | 11:11 Decoration Nepal',
    description:
      'A premier decorations and event management company in Nepal. Over 500 events completed.',
    url: 'https://decorationnepal.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
