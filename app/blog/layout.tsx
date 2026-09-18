import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Tips, guides, and inspiration for your next event in Nepal. Wedding decoration trends, birthday party planning, venue guides, and more from Eleven Eleven.',
  keywords: [
    'event blog nepal', 'wedding decoration tips', 'birthday party guide',
    'decoration ideas nepal', 'event planning blog',
  ],
  openGraph: {
    title: 'Blog | 11:11 Decoration Nepal',
    description: 'Tips, guides, and inspiration for your next event in Nepal.',
    url: 'https://decorationnepal.com/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
