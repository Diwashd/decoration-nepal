'use client';

interface JsonLdProps {
  type?: string;
  data?: Record<string, any>;
}

const defaultBusinessData = {
  '@context': 'https://schema.org',
  '@type': 'EventPlanner',
  name: '11:11 Decoration Nepal',
  alternateName: 'Eleven Eleven Decoration Nepal',
  description:
    'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary decorations crafted with excellence.',
  url: 'https://decorationnepal.com',
  telephone: '+977-9847411305',
  email: 'event.eleveneleven@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jawalakhel',
    addressLocality: 'Lalitpur',
    addressRegion: 'Bagmati',
    postalCode: '44600',
    addressCountry: 'NP',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 27.6813,
    longitude: 85.3173,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '$$',
  areaServed: [
    { '@type': 'City', name: 'Kathmandu' },
    { '@type': 'City', name: 'Pokhara' },
    { '@type': 'City', name: 'Chitwan' },
    { '@type': 'City', name: 'Lalitpur' },
    { '@type': 'City', name: 'Bhaktapur' },
  ],
  serviceType: [
    'Wedding Decoration',
    'Birthday Decoration',
    'Anniversary Decoration',
    'Pasni Decoration',
    'Corporate Event Decoration',
    'Venue Finding',
    'Event Photography',
    'Catering Services',
    'Makeup Artist',
    'Band Baja',
  ],
  sameAs: [
    'https://www.facebook.com/11byNK',
    'https://www.instagram.com/11byNK',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Rupam Pariyar' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Thank you so much, your team did best work, I am so glad.',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Aayush Pradhan' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Thank you so much 11:11 team. You made my wedding awesome!',
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Arun Karki' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Thank you for your help and support, it was awesome working with your team.',
    },
  ],
};

// Event type specific schemas
const eventSchemas: Record<string, Record<string, any>> = {
  'wedding-decoration': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Wedding Decoration in Nepal',
    description: 'Complete wedding decoration services — mandap, stage, entrance gate, reception setup.',
    provider: { '@type': 'EventPlanner', name: '11:11 Decoration Nepal' },
    areaServed: { '@type': 'Country', name: 'Nepal' },
    serviceType: 'Wedding Decoration',
    offers: { '@type': 'Offer', priceCurrency: 'NPR', price: '25000' },
  },
  'birthday-decoration': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Birthday Decoration in Nepal',
    description: 'Creative birthday party decorations in Nepal. Balloon arrangements, themed setups.',
    provider: { '@type': 'EventPlanner', name: '11:11 Decoration Nepal' },
    areaServed: { '@type': 'Country', name: 'Nepal' },
    serviceType: 'Birthday Decoration',
  },
  'pasni-decoration': {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Pasni Decoration in Nepal',
    description: 'Traditional Pasni ceremony decoration in Nepal. Cultural richness with modern aesthetics.',
    provider: { '@type': 'EventPlanner', name: '11:11 Decoration Nepal' },
    areaServed: { '@type': 'Country', name: 'Nepal' },
    serviceType: 'Pasni Decoration',
  },
};

// FAQ schema for pages
const faqData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What services does 11:11 Decoration Nepal offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer wedding decoration, birthday decoration, anniversary decoration, Pasni decoration, Haldi/Mehendi decoration, venue finding, photography, catering, makeup, band baja, DJ lights, and car decoration services.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is 11:11 Decoration Nepal located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We are located in Jawalakhel, Lalitpur, Nepal. We serve events across Kathmandu, Pokhara, Chitwan, and other locations in Nepal.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book an event with 11:11 Decoration Nepal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can book by calling +977-9847411305, emailing event.eleveneleven@gmail.com, visiting our office in Jawalakhel Lalitpur, or using our online event planner at decorationnepal.com/planner.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does wedding decoration cost in Nepal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Wedding decoration packages start from Rs. 25,000 for mandap decoration. Prices vary based on venue, guest count, theme, and customization. Contact us for a personalized quotation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide services outside Kathmandu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we serve events across Nepal including Pokhara, Chitwan, and other destinations. We have partner venues and vendors in multiple cities.',
      },
    },
  ],
};

export default function JsonLd({ type, data }: JsonLdProps) {
  let schemaData = data || defaultBusinessData;

  if (type && type in eventSchemas) {
    schemaData = eventSchemas[type];
  }

  if (type === 'faq') {
    schemaData = faqData;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

// Export for use in pages
export { defaultBusinessData, eventSchemas, faqData };
