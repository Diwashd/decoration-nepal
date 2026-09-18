import type { Metadata } from 'next';

const siteUrl = 'https://decorationnepal.com';
const siteName = '11:11 Decoration Nepal';

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || '/og-image.jpg';

  return {
    title,
    description,
    keywords: [
      'decoration in nepal', 'event planning nepal',
      ...keywords,
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
  };
}

// Page-specific metadata
export const homeMetadata: Metadata = generatePageMetadata({
  title: 'Luxury Event Planning & Decoration Services',
  description:
    'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary decorations crafted with excellence. One-stop event solution.',
  path: '/',
  keywords: [
    'luxury event planning nepal', 'decoration services nepal',
    'wedding planner kathmandu', 'event management company nepal',
  ],
});

export const aboutMetadata: Metadata = generatePageMetadata({
  title: 'About Us',
  description:
    'Welcome to Eleven Eleven (11:11) — a premier decorations and event management company in Nepal. Sister company to Naulo Koseli (NK). Over 500 events completed.',
  path: '/about',
  keywords: [
    'about eleven eleven nepal', 'event management company nepal',
    'naulo koseli', 'decoration company kathmandu',
  ],
});

export const servicesMetadata: Metadata = generatePageMetadata({
  title: 'Our Services',
  description:
    'Complete event solutions in Nepal — decoration, venue finding, photography, makeup, catering, band baja, DJ lights, car decoration, and more.',
  path: '/services',
  keywords: [
    'decoration services nepal', 'wedding decoration', 'venue finding nepal',
    'event catering nepal', 'makeup artist kathmandu', 'band baja nepal',
  ],
});

export const contactMetadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description:
    'Book your extraordinary event today. Contact Eleven Eleven Decoration Nepal at +977-9847411305. Jawalakhel, Lalitpur, Nepal.',
  path: '/contact',
  keywords: [
    'contact decoration nepal', 'book event nepal', 'event inquiry kathmandu',
    'decoration booking nepal', 'party planning contact',
  ],
});

export const plannerMetadata: Metadata = generatePageMetadata({
  title: 'Event Planner',
  description:
    'Plan your dream event with our interactive wizard. Choose event type, destination, theme, and get a customized quotation within 24 hours.',
  path: '/planner',
  keywords: [
    'event planner nepal', 'wedding planner kathmandu', 'event quotation nepal',
    'decoration quote nepal', 'party planner online',
  ],
});

export const myEventsMetadata: Metadata = generatePageMetadata({
  title: 'My Events',
  description:
    'Track your decoration requests, view quotations, and monitor event status with Eleven Eleven Decoration Nepal.',
  path: '/my-events',
  keywords: ['track event nepal', 'my events decoration'],
});

// Event type page metadata
export const eventTypeMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
  'wedding-decoration': {
    title: 'Wedding Decoration in Nepal',
    description:
      'Complete wedding decoration services in Nepal — mandap, stage, entrance gate, reception setup. Luxury wedding decoration by Eleven Eleven.',
    keywords: ['wedding decoration nepal', 'wedding mandap kathmandu', 'marriage decoration', 'reception decoration nepal'],
  },
  'birthday-decoration': {
    title: 'Birthday Decoration in Nepal',
    description:
      'Creative birthday party decorations in Nepal. Balloon arrangements, themed setups, surprise planning for all ages.',
    keywords: ['birthday decoration nepal', 'birthday party kathmandu', 'surprise birthday nepal', 'balloon decoration'],
  },
  'anniversary-decoration': {
    title: 'Anniversary Decoration in Nepal',
    description:
      'Romantic anniversary decoration setups in Nepal. Celebrate your love story with elegant decor and personalized touches.',
    keywords: ['anniversary decoration nepal', 'anniversary celebration kathmandu', 'romantic setup nepal'],
  },
  'pasni-decoration': {
    title: 'Pasni Decoration in Nepal',
    description:
      'Traditional Pasni (rice-feeding) ceremony decoration in Nepal. Cultural richness with modern aesthetics.',
    keywords: ['pasni decoration nepal', 'rice feeding ceremony', 'pasni ceremony kathmandu', 'bratabandha decoration'],
  },
  'haldi-decoration': {
    title: 'Haldi Ceremony Decoration in Nepal',
    description:
      'Vibrant Haldi ceremony decorations in Nepal. Colorful, traditional, and festive setups for pre-wedding celebrations.',
    keywords: ['haldi decoration nepal', 'haldi ceremony kathmandu', 'turmeric ceremony decoration'],
  },
  'mehendi-decoration': {
    title: 'Mehendi Ceremony Decoration in Nepal',
    description:
      'Colorful Mehendi ceremony decorations in Nepal. Beautiful setups for this traditional pre-wedding celebration.',
    keywords: ['mehendi decoration nepal', 'mehendi ceremony kathmandu', 'henna ceremony decoration'],
  },
  'engagement-decoration': {
    title: 'Engagement Ceremony Decoration in Nepal',
    description:
      'Beautiful engagement ceremony decorations in Nepal. Elegant ring ceremony setups and romantic decor.',
    keywords: ['engagement decoration nepal', 'ring ceremony kathmandu', 'engagement party decoration'],
  },
  'proposal-setup': {
    title: 'Proposal Setup in Nepal',
    description:
      'Romantic proposal setups in Nepal. Flowers, candles, props, and personalized decorations for the perfect moment.',
    keywords: ['proposal setup nepal', 'marriage proposal decoration', 'romantic proposal kathmandu'],
  },
  'baby-shower-decoration': {
    title: 'Baby Shower Decoration in Nepal',
    description:
      'Adorable baby shower decorations in Nepal. Welcome the little one with charming themed setups.',
    keywords: ['baby shower decoration nepal', 'godh bharai decoration', 'baby shower kathmandu'],
  },
  'corporate-event-decoration': {
    title: 'Corporate Event Decoration in Nepal',
    description:
      'Professional corporate event decoration in Nepal. Product launches, inaugurations, galas, and conferences.',
    keywords: ['corporate event nepal', 'office event decoration', 'product launch kathmandu', 'inauguration decoration'],
  },
};
