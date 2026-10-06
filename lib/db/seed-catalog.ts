import { eq } from 'drizzle-orm';
import { db } from './index';
import {
  blogPosts,
  destinations,
  eventTypes,
  packages,
  services,
  users,
} from './schema';

const serviceSeed = [
  ['Event Decoration', 'core', 'Complete event decoration with floral arrangements, stage setup, backdrop designs, and themed decor.', 25000, '🎨'],
  ['Venue Finding', 'core', 'Find and book the perfect venue from our curated list of premium venues across Nepal.', 0, '🏛️'],
  ['Photo & Video', 'core', 'Professional photography and videography services to capture every precious moment.', 35000, '📸'],
  ['Makeup Artist', 'core', 'Expert makeup artists for bridal, party, and special occasion looks using premium products.', 15000, '💄'],
  ['Band & Music', 'core', 'Live band performances, DJ services, and musical entertainment for celebrations.', 20000, '🎵'],
  ['Catering', 'core', 'Premium catering with customizable menus from traditional Nepali to international cuisines.', 800, '🍽️'],
  ['Car Decoration', 'additional', 'Beautiful car decoration for wedding processions with flowers, ribbons, and lights.', 5000, '🚗'],
  ['Sound System', 'additional', 'Professional sound system rental with speakers, microphones, and audio equipment.', 8000, '🔊'],
  ['DJ Lights', 'additional', 'Professional DJ setup with lighting effects and dance floor illumination.', 12000, '💡'],
  ['Baggi Service', 'additional', 'Traditional horse-drawn carriage for grand wedding arrivals and processions.', 15000, '🐎'],
  ['Proposal Setup', 'additional', 'Romantic proposal arrangements with flowers, candles, personalized decor, and photography.', 10000, '💍'],
  ['Kisti Gift Tray', 'additional', 'Beautifully arranged gift trays with traditional items for ceremonies.', 3000, '🎁'],
] as const;

const destinationSeed = [
  ['Hotel Shree Lekha', 'Thamel, Kathmandu', 'hotel', '50-500 guests', 'Rs. 1,50,000 - Rs. 8,00,000', 4.8, 'Premium hotel with state-of-the-art banquet halls and rooftop event space.', ['Banquet Hall', 'Rooftop', 'Parking', 'Catering', 'AC'], true],
  ['ChhyaChaa Banquet Hall', 'Jhamsikhel, Lalitpur', 'banquet', '30-300 guests', 'Rs. 1,20,000 - Rs. 6,00,000', 4.6, 'Elegant banquet halls with traditional Newari architecture and modern amenities.', ['Indoor Hall', 'Garden', 'Parking', 'Catering', 'AC'], true],
  ['Monsoon Banquet & Lawn', 'Patan, Lalitpur', 'banquet', '40-400 guests', 'Rs. 1,80,000 - Rs. 7,50,000', 4.7, 'Contemporary banquet hall with stunning courtyard and premium catering.', ['Courtyard', 'Banquet Hall', 'Parking', 'Catering', 'AC'], true],
  ['Classic Diamond Party Palace', 'Putalisadak, Kathmandu', 'party_palace', '60-600 guests', 'Rs. 2,00,000 - Rs. 10,00,000', 4.9, 'Nepal’s premier party palace with grand ballroom and multiple event halls.', ['Grand Ballroom', 'Multiple Halls', 'Parking', 'Catering', 'AC'], true],
  ['Batasia Banquet Hall', 'New Baneshwor, Kathmandu', 'banquet', '25-250 guests', 'Rs. 80,000 - Rs. 4,00,000', 4.4, 'Cozy banquet space with excellent food and affordable packages.', ['Banquet Hall', 'Parking', 'Catering', 'AC'], false],
] as const;

const blogSeed = [
  ['Top 10 Wedding Decoration Trends in Nepal for 2026', 'wedding-decoration-trends-nepal-2026', 'Discover the latest wedding decoration trends taking Nepal by storm, from floral arches to minimalist mandaps.', 'Wedding', ['wedding', 'decoration', 'trends', 'nepal'], 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop'],
  ['How to Plan the Perfect Birthday Party in Kathmandu', 'plan-perfect-birthday-party-kathmandu', 'A complete guide to organizing an unforgettable birthday celebration in Kathmandu.', 'Birthday', ['birthday', 'party', 'planning', 'kathmandu'], 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop'],
  ['Traditional Pasni Ceremony: Decoration Ideas & Guide', 'pasni-ceremony-decoration-ideas', 'Explore Pasni decoration ideas that blend cultural richness with modern aesthetics.', 'Pasni', ['pasni', 'ceremony', 'traditional', 'decoration'], 'https://images.unsplash.com/photo-1545232906-ddfd367fe86a?q=80&w=800&auto=format&fit=crop'],
] as const;

async function seedCatalog() {
  const existingServices = await db.select({ name: services.name }).from(services);
  const serviceNames = new Set(existingServices.map((service) => service.name));
  for (const [name, category, description, basePrice, icon] of serviceSeed) {
    if (serviceNames.has(name)) continue;
    await db.insert(services).values({
      name,
      description,
      basePrice,
      costPrice: 0,
      unit: 'item',
      images: [{ category, icon }],
      isActive: true,
    });
  }

  const existingDestinations = await db.select({ name: destinations.name }).from(destinations);
  const destinationNames = new Set(existingDestinations.map((destination) => destination.name));
  for (const [name, location, type, capacity, priceRange, rating, description, amenities, featured] of destinationSeed) {
    if (destinationNames.has(name)) continue;
    await db.insert(destinations).values({
      name,
      location,
      type,
      capacity,
      priceRange,
      rating,
      description,
      amenities,
      featured,
      isActive: true,
    });
  }

  const eventTypeRows = await db.select({ id: eventTypes.id, slug: eventTypes.slug }).from(eventTypes);
  const eventTypeBySlug = new Map(eventTypeRows.map((eventType) => [eventType.slug, eventType.id]));
  const packageSeed = [
    ['Wedding Essentials', 'wedding-decoration', 'A beautiful wedding setup with mandap, stage, entrance, and floral decor.', 125000],
    ['Birthday Celebration', 'birthday-decoration', 'Colorful birthday backdrop, balloon styling, cake table, and lighting.', 35000],
    ['Pasni Tradition', 'pasni-decoration', 'Traditional Pasni styling with a cultural backdrop, seating, and floral accents.', 45000],
    ['Romantic Anniversary', 'anniversary-decoration', 'An intimate anniversary setup with candles, flowers, and personalized details.', 30000],
  ] as const;
  const existingPackages = await db.select({ name: packages.name }).from(packages);
  const packageNames = new Set(existingPackages.map((pkg) => pkg.name));
  for (const [name, eventSlug, description, basePrice] of packageSeed) {
    const eventTypeId = eventTypeBySlug.get(eventSlug);
    if (!eventTypeId || packageNames.has(name)) continue;
    await db.insert(packages).values({ name, eventTypeId, description, basePrice, isActive: true });
  }

  const admin = await db.select({ id: users.id }).from(users).where(eq(users.email, 'admin@decorationnepal.com')).limit(1);
  const authorId = admin[0]?.id;
  const existingPosts = await db.select({ slug: blogPosts.slug }).from(blogPosts);
  const postSlugs = new Set(existingPosts.map((post) => post.slug));
  for (const [title, slug, excerpt, category, tags, coverImage] of blogSeed) {
    if (postSlugs.has(slug)) continue;
    await db.insert(blogPosts).values({
      title,
      slug,
      excerpt,
      content: `${excerpt}\n\nPlanning an event in Nepal is easier with thoughtful design, reliable vendors, and a clear timeline. Our team can help you turn these ideas into a memorable celebration.`,
      category,
      tags,
      coverImage,
      authorId,
      status: 'published',
      publishedAt: new Date(),
      isFeatured: true,
    });
  }

  const [serviceCount, destinationCount, packageCount, blogCount] = await Promise.all([
    db.select({ name: services.name }).from(services),
    db.select({ name: destinations.name }).from(destinations),
    db.select({ name: packages.name }).from(packages),
    db.select({ slug: blogPosts.slug }).from(blogPosts),
  ]);
  console.log(JSON.stringify({
    services: serviceCount.length,
    destinations: destinationCount.length,
    packages: packageCount.length,
    blogPosts: blogCount.length,
  }));
}

seedCatalog()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Catalog seed failed:', error);
    process.exit(1);
  });
