import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Book your extraordinary event today. Contact Eleven Eleven Decoration Nepal at +977-9847411305. Jawalakhel, Lalitpur, Nepal. Open Sun–Fri 9AM–6PM.',
  keywords: [
    'contact decoration nepal', 'book event nepal', 'event inquiry kathmandu',
    'decoration booking nepal', 'party planning contact nepal',
  ],
  openGraph: {
    title: 'Contact Us | 11:11 Decoration Nepal',
    description:
      'Book your extraordinary event today. Call +977-9847411305 or visit us in Jawalakhel, Lalitpur.',
    url: 'https://decorationnepal.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
