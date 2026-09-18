import type { Metadata } from "next";
import { Playfair_Display, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import JsonLd from '@/components/seo/JsonLd';
import GoogleAnalytics from '@/components/seo/GoogleAnalytics';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = 'https://decorationnepal.com';

export const metadata: Metadata = {
  title: {
    default: '11:11 Decoration Nepal | Luxury Event Planning & Decoration Services',
    template: '%s | 11:11 Decoration Nepal',
  },
  description:
    'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary, Haldi, Mehendi decorations crafted with excellence. One-stop event solution in Kathmandu, Pokhara, and Chitwan.',
  keywords: [
    'decoration in nepal', 'event planning nepal', 'wedding decoration nepal',
    'birthday decoration', 'pasni decoration', 'anniversary decoration',
    'haldi mehendi decoration', 'party palace kathmandu', 'event management nepal',
    '11:11 decoration', 'eleven eleven nepal', 'venue finding nepal',
    'wedding mandap decoration', 'corporate event nepal', 'proposal setup nepal',
  ],
  authors: [{ name: 'Eleven Eleven Decoration Nepal' }],
  creator: 'Eleven Eleven Decoration Nepal',
  publisher: 'Eleven Eleven Decoration Nepal',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: '11:11 Decoration Nepal',
    title: '11:11 Decoration Nepal | Luxury Event Planning & Decoration',
    description:
      'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary decorations crafted with excellence.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '11:11 Decoration Nepal - Luxury Event Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '11:11 Decoration Nepal | Luxury Event Planning & Decoration',
    description:
      'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary decorations crafted with excellence.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <GoogleAnalytics />
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
