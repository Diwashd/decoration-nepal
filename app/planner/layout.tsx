import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Planner',
  description:
    'Plan your dream event with our interactive wizard. Choose event type, destination, theme, and get a customized quotation within 24 hours. Free event planning in Nepal.',
  keywords: [
    'event planner nepal', 'wedding planner kathmandu', 'event quotation nepal',
    'decoration quote nepal', 'party planner online nepal', 'free event planning',
  ],
  openGraph: {
    title: 'Event Planner | 11:11 Decoration Nepal',
    description:
      'Plan your dream event. Choose event type, destination, and theme — get a quote within 24 hours.',
    url: 'https://decorationnepal.com/planner',
  },
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
