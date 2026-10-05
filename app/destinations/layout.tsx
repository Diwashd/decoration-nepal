import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Venues in Nepal',
  description:
    'Explore verified hotels, banquet halls, party palaces, and restaurants for weddings and events in Kathmandu, Lalitpur, Pokhara, and across Nepal.',
  keywords: [
    'event venues nepal',
    'wedding venues kathmandu',
    'banquet halls lalitpur',
    'party palace nepal',
    'restaurants for events',
  ],
  openGraph: {
    title: 'Event Venues in Nepal | 11:11 Decoration Nepal',
    description:
      'Find the right hotel, banquet hall, party palace, or restaurant for your next event in Nepal.',
    url: 'https://decorationnepal.com/destinations',
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
