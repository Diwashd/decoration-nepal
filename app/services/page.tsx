import CustomerLayout from '@/components/customer/CustomerLayout';
import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { packages, services } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Our Services | 11:11 Decoration Nepal',
  description: 'Complete event planning services in Nepal: decoration, venue finding, photo & video, makeup, band & music, catering, and more.',
};

const coreServices = [
  { id: '1', name: 'Event Decoration', icon: '🎨', description: 'Complete event decoration with floral arrangements, stage setup, backdrop designs, and themed decor for weddings, birthdays, and corporate events.', price: 'From Rs. 25,000', features: ['Floral Arrangements', 'Stage Setup', 'Backdrop Design', 'Theme Decor', 'Lighting', 'Furniture Styling'] },
  { id: '2', name: 'Venue Finding', icon: '🏛️', description: 'We help you discover and book the perfect venue from our curated list of premium hotels, restaurants, and party palaces across Nepal.', price: 'Free Service', features: ['Curated Venue List', 'Site Visits', 'Price Negotiation', 'Contract Handling', 'Capacity Planning', 'Logistics Coordination'] },
  { id: '3', name: 'Photo & Video', icon: '📸', description: 'Professional photography and videography services with cinematic highlights, drone coverage, and same-day edits.', price: 'From Rs. 35,000', features: ['Professional Photography', 'Cinematic Video', 'Drone Coverage', 'Same-Day Edit', 'Photo Album', 'Online Gallery'] },
  { id: '4', name: 'Makeup Artist', icon: '💄', description: 'Expert makeup artists for bridal, party, and special occasion looks using premium international and local products.', price: 'From Rs. 15,000', features: ['Bridal Makeup', 'Party Makeup', 'Airbrush Technique', 'Hair Styling', 'Pre-Wedding Look', 'Touch-ups'] },
  { id: '5', name: 'Band & Music', icon: '🎵', description: 'Live band performances, DJ services, Dhol Nagara, and musical entertainment for all types of celebrations.', price: 'From Rs. 20,000', features: ['Live Band', 'DJ Services', 'Dhol Nagara', 'Sound System', 'Lighting Effects', 'MC Services'] },
  { id: '6', name: 'Catering', icon: '🍽️', description: 'Premium catering services with customizable menus from traditional Nepali to international cuisines with professional service staff.', price: 'From Rs. 800/head', features: ['Custom Menu', 'Buffet Setup', 'Live Counters', 'Traditional Nepali', 'Continental', 'Service Staff'] },
];

const additionalServices = [
  { id: '7', name: 'Car Decoration', icon: '🚗', description: 'Beautiful car decoration for wedding processions with flowers, ribbons, and lights.', price: 'From Rs. 5,000' },
  { id: '8', name: 'Sound System', icon: '🔊', description: 'Professional sound system rental with speakers, microphones, and audio equipment.', price: 'From Rs. 8,000' },
  { id: '9', name: 'DJ Lights', icon: '💡', description: 'Professional DJ setup with lighting effects, dance floor illumination, and party atmosphere.', price: 'From Rs. 12,000' },
  { id: '10', name: 'Baggi Service', icon: '🐎', description: 'Traditional horse-drawn carriage for grand wedding arrivals and special processions.', price: 'From Rs. 15,000' },
  { id: '11', name: 'Proposal Setup', icon: '💍', description: 'Romantic proposal arrangements with flowers, candles, personalized decor, and photographer.', price: 'From Rs. 10,000' },
  { id: '12', name: 'Kisti Gift Tray', icon: '🎁', description: 'Beautifully arranged gift trays with traditional items for engagement and ceremony rituals.', price: 'From Rs. 3,000' },
];

const eventTypes = [
  { name: 'Wedding Decoration', icon: '💒', slug: 'wedding' },
  { name: 'Birthday Party', icon: '🎂', slug: 'birthday' },
  { name: 'Pasni Ceremony', icon: '👶', slug: 'pasni' },
  { name: 'Anniversary', icon: '💕', slug: 'anniversary' },
  { name: 'Haldi Mehendi', icon: '🌼', slug: 'haldi' },
  { name: 'Date Planner', icon: '🌹', slug: 'date-planner' },
  { name: 'Surprise Plan', icon: '🎁', slug: 'surprise' },
  { name: 'Proposal Setup', icon: '💍', slug: 'proposal' },
  { name: 'Corporate Event', icon: '🏢', slug: 'corporate' },
  { name: 'Inauguration', icon: ' ribbon', slug: 'inauguration' },
];

interface DisplayService {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: string;
  category: 'core' | 'additional';
  features: string[];
}

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const [activeServices, activePackages] = await Promise.all([
    db.query.services.findMany({
      where: eq(services.isActive, true),
      orderBy: [asc(services.sortOrder), asc(services.name)],
    }),
    db.query.packages.findMany({
      where: eq(packages.isActive, true),
      with: { eventType: true },
      orderBy: [asc(packages.sortOrder), asc(packages.name)],
    }),
  ]);

  const databaseServices = activeServices.map((service) => {
    const metadata = Array.isArray(service.images) && service.images[0] && typeof service.images[0] === 'object'
      ? service.images[0] as { category?: string; icon?: string }
      : {};
    return {
      id: service.id,
      name: service.name,
      icon: metadata.icon || '✨',
      description: service.description || '',
      price: service.basePrice === 0 ? 'Free Service' : `From Rs. ${service.basePrice.toLocaleString('en-NP')}`,
      category: (metadata.category === 'additional' ? 'additional' : 'core') as 'core' | 'additional',
      features: [],
    };
  });
  const displayServices: DisplayService[] = databaseServices.length > 0
    ? databaseServices
    : [
        ...coreServices.map(service => ({ ...service, category: 'core' as const })),
        ...additionalServices.map(service => ({ ...service, category: 'additional' as const, features: [] })),
      ];
  const displayCoreServices = displayServices.filter(service => service.category === 'core');
  const displayAdditionalServices = displayServices.filter(service => service.category === 'additional');

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="relative py-20 bg-surface-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-cream-contrast mb-4">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            From concept to execution, we provide end-to-end event planning services. 
            Every detail is handled with passion and precision.
          </p>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold font-display text-cream-contrast mb-8">
          Core <span className="text-primary">Services</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCoreServices.map((service) => (
            <div key={service.id} className="bg-surface-container border border-outline-variant rounded-2xl p-6 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{service.icon}</span>
                <div>
                  <h3 className="font-bold text-cream-contrast">{service.name}</h3>
                  <p className="text-sm text-primary font-medium">{service.price}</p>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">{service.description}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {service.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <Check className="w-3 h-3 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-surface-container">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold font-display text-cream-contrast mb-8">
            Additional <span className="text-primary">Services</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayAdditionalServices.map((service) => (
              <div key={service.id} className="bg-surface border border-outline-variant rounded-xl p-4 hover:border-primary/30 transition-all flex items-start gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-cream-contrast text-sm">{service.name}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">{service.description}</p>
                  <p className="text-xs text-primary font-medium mt-2">{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      {activePackages.length > 0 && (
        <section className="py-16 bg-surface-container">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold font-display text-cream-contrast mb-8">
              Event <span className="text-primary">Packages</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activePackages.map((pkg) => (
                <div key={pkg.id} className="bg-surface border border-outline-variant rounded-xl p-5">
                  <h3 className="font-semibold text-cream-contrast">{pkg.name}</h3>
                  <p className="text-xs text-primary mt-1">{pkg.eventType.name}</p>
                  {pkg.description && <p className="text-sm text-on-surface-variant mt-3">{pkg.description}</p>}
                  <p className="text-lg text-primary font-semibold mt-4">Rs. {pkg.basePrice.toLocaleString('en-NP')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Event Types */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold font-display text-cream-contrast mb-8">
          Events We <span className="text-primary">Specialize</span> In
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {eventTypes.map((et) => (
            <Link
              key={et.slug}
              href={`/planner?event=${et.slug}`}
              className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{et.icon}</span>
              <p className="text-sm font-medium text-cream-contrast group-hover:text-primary transition-colors">{et.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold font-display text-cream-contrast mb-3">Ready to Plan Your Event?</h3>
          <p className="text-on-surface-variant mb-6 max-w-lg mx-auto">Tell us your vision and we&apos;ll create something magical. Get a free consultation today.</p>
          <div className="flex justify-center gap-4">
            <Link href="/planner" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-fixed transition-colors">
              Start Planning
            </Link>
            <Link href="/contact" className="border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-on-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
