// Central admin data store using localStorage
// Admin writes here, frontend reads from here

export interface AdminStoreDestination {
  id: string;
  name: string;
  location: string;
  type: string;
  capacity: string;
  priceRange: string;
  description: string;
  contact: string;
  amenities: string[];
  image: string;
  featured: boolean;
  rating: number;
  active: boolean;
  order?: number;
}

export interface AdminStoreService {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  icon: string;
  image: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface AdminStoreBlog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface AdminStorePackage {
  id: string;
  name: string;
  eventTypeId: string;
  description: string;
  basePrice: number;
  coverImage: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface AdminStoreGalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  eventType: string;
  featured: boolean;
  order: number;
  createdAt: string;
}

// ---- DEFAULT DATA (used if localStorage is empty) ----

export const defaultDestinations: AdminStoreDestination[] = [
  { id: '1', name: 'Hotel & Restaurant Shree Lekha', location: 'Thamel, Kathmandu', type: 'hotel', capacity: '50-500 guests', priceRange: 'Rs. 1,50,000 - Rs. 8,00,000', description: 'Premium hotel with state-of-the-art banquet halls and rooftop event space.', contact: '+977-1-4423456', amenities: ['Banquet Hall', 'Rooftop', 'Parking', 'Catering', 'AC', 'Sound System'], image: '', featured: true, rating: 4.8, active: true },
  { id: '2', name: 'ChhyaChaa Banquet Hall', location: 'Jhamsikhel, Lalitpur', type: 'banquet', capacity: '30-300 guests', priceRange: 'Rs. 1,20,000 - Rs. 6,00,000', description: 'Elegant banquet halls with traditional Newari architecture and modern amenities.', contact: '+977-1-5534567', amenities: ['Indoor Hall', 'Garden', 'Parking', 'Catering', 'AC'], image: '', featured: true, rating: 4.6, active: true },
  { id: '3', name: 'Monsoon Banquet & Lawn', location: 'Patan, Lalitpur', type: 'banquet', capacity: '40-400 guests', priceRange: 'Rs. 1,80,000 - Rs. 7,50,000', description: 'Contemporary banquet hall with stunning courtyard and premium catering.', contact: '+977-1-5545678', amenities: ['Courtyard', 'Banquet Hall', 'Parking', 'Catering', 'AC', 'Pool'], image: '', featured: true, rating: 4.7, active: true },
  { id: '4', name: 'Classic Diamond Party Palace', location: 'Putalisadak, Kathmandu', type: 'party_palace', capacity: '60-600 guests', priceRange: 'Rs. 2,00,000 - Rs. 10,00,000', description: "Nepal's premier party palace with grand ballroom and multiple event halls.", contact: '+977-1-4256789', amenities: ['Grand Ballroom', 'Multiple Halls', 'Parking', 'Catering', 'AC', 'Sound System', 'Stage'], image: '', featured: true, rating: 4.9, active: true },
  { id: '5', name: 'Batasia Banquet Hall', location: 'New Baneshwor, Kathmandu', type: 'banquet', capacity: '25-250 guests', priceRange: 'Rs. 80,000 - Rs. 4,00,000', description: 'Cozy banquet space with excellent food and affordable packages.', contact: '+977-1-4789012', amenities: ['Banquet Hall', 'Parking', 'Catering', 'AC'], image: '', featured: false, rating: 4.4, active: true },
  { id: '6', name: 'Golden Gate Party Palace', location: 'Dillibazar, Kathmandu', type: 'party_palace', capacity: '30-200 guests', priceRange: 'Rs. 60,000 - Rs. 3,00,000', description: 'Budget-friendly party venue with great food and flexible setup.', contact: '+977-1-4434567', amenities: ['Indoor Hall', 'Private Room', 'Catering', 'AC'], image: '', featured: false, rating: 4.3, active: true },
  { id: '7', name: 'Hotel Jhaptek', location: 'Maharajgunj, Kathmandu', type: 'hotel', capacity: '40-350 guests', priceRange: 'Rs. 1,30,000 - Rs. 5,50,000', description: 'Well-appointed hotel with modern facilities and professional event management.', contact: '+977-1-4512345', amenities: ['Banquet Hall', 'Lawn', 'Parking', 'Catering', 'AC', 'Sound System'], image: '', featured: false, rating: 4.5, active: true },
  { id: '8', name: 'Gorkha Kulfi Restaurant', location: 'Boudha, Kathmandu', type: 'hotel', capacity: '20-100 guests', priceRange: 'Rs. 30,000 - Rs. 1,50,000', description: 'Quaint venue near Boudhanath Stupa, perfect for intimate gatherings.', contact: '+977-1-4912345', amenities: ['Outdoor Seating', 'Catering', 'Cultural Ambiance'], image: '', featured: false, rating: 4.2, active: true },
  { id: '9', name: 'Hotel Jhanki', location: 'Lagankhel, Lalitpur', type: 'hotel', capacity: '35-300 guests', priceRange: 'Rs. 1,00,000 - Rs. 4,50,000', description: 'Traditional hospitality meets modern amenities with excellent banquet facilities.', contact: '+977-1-5523456', amenities: ['Banquet Hall', 'Garden', 'Parking', 'Catering', 'AC'], image: '', featured: false, rating: 4.4, active: true },
  { id: '10', name: 'Rare Haven Banquet', location: 'Sanepa, Lalitpur', type: 'banquet', capacity: '25-200 guests', priceRange: 'Rs. 90,000 - Rs. 3,80,000', description: 'Boutique banquet space with stunning decor and personalized service.', contact: '+977-1-5545679', amenities: ['Indoor/Outdoor', 'Catering', 'AC', 'Decor Included'], image: '', featured: false, rating: 4.5, active: true },
];

export const defaultServices: AdminStoreService[] = [
  { id: '1', name: 'Event Decoration', category: 'core', description: 'Complete event decoration with floral arrangements, stage setup, backdrop designs, and themed decor.', price: 'From Rs. 25,000', icon: '🎨', image: '', featured: true, active: true, order: 1 },
  { id: '2', name: 'Venue Finding', category: 'core', description: 'We help you discover and book the perfect venue from our curated list of premium venues.', price: 'Free Service', icon: '🏛️', image: '', featured: true, active: true, order: 2 },
  { id: '3', name: 'Photo & Video', category: 'core', description: 'Professional photography and videography services with cinematic highlights and drone coverage.', price: 'From Rs. 35,000', icon: '📸', image: '', featured: true, active: true, order: 3 },
  { id: '4', name: 'Makeup Artist', category: 'core', description: 'Expert makeup artists for bridal, party, and special occasion looks using premium products.', price: 'From Rs. 15,000', icon: '💄', image: '', featured: true, active: true, order: 4 },
  { id: '5', name: 'Band & Music', category: 'core', description: 'Live band performances, DJ services, Dhol Nagara, and musical entertainment for all celebrations.', price: 'From Rs. 20,000', icon: '🎵', image: '', featured: true, active: true, order: 5 },
  { id: '6', name: 'Catering', category: 'core', description: 'Premium catering services with customizable menus from traditional Nepali to international cuisines.', price: 'From Rs. 800/head', icon: '🍽️', image: '', featured: true, active: true, order: 6 },
  { id: '7', name: 'Car Decoration', category: 'additional', description: 'Beautiful car decoration for wedding processions with flowers, ribbons, and lights.', price: 'From Rs. 5,000', icon: '🚗', image: '', featured: false, active: true, order: 7 },
  { id: '8', name: 'Sound System', category: 'additional', description: 'Professional sound system rental with speakers, microphones, and audio equipment.', price: 'From Rs. 8,000', icon: '🔊', image: '', featured: false, active: true, order: 8 },
  { id: '9', name: 'DJ Lights', category: 'additional', description: 'Professional DJ setup with lighting effects, dance floor illumination, and party atmosphere.', price: 'From Rs. 12,000', icon: '💡', image: '', featured: false, active: true, order: 9 },
  { id: '10', name: 'Baggi Service', category: 'additional', description: 'Traditional horse-drawn carriage for grand wedding arrivals and special processions.', price: 'From Rs. 15,000', icon: '🐎', image: '', featured: false, active: true, order: 10 },
  { id: '11', name: 'Proposal Setup', category: 'additional', description: 'Romantic proposal arrangements with flowers, candles, personalized decor, and photographer.', price: 'From Rs. 10,000', icon: '💍', image: '', featured: false, active: true, order: 11 },
  { id: '12', name: 'Kisti Gift Tray', category: 'additional', description: 'Beautifully arranged gift trays with traditional items for engagement and ceremony rituals.', price: 'From Rs. 3,000', icon: '🎁', image: '', featured: false, active: true, order: 12 },
];

export const defaultBlogPosts: AdminStoreBlog[] = [
  {
    id: '1', title: 'Top 10 Wedding Decoration Trends in Nepal for 2026', slug: 'wedding-decoration-trends-nepal-2026',
    content: '## 1. Floral Arch Mandaps\n\nGone are the traditional rigid mandap structures. In 2026, we see a beautiful shift towards organic, flowing floral arches that create a dreamy canopy.\n\n## 2. Minimalist Gold Accents\n\nThe "less is more" trend continues with subtle gold touches.\n\n## 3. Sustainable Decor\n\nEco-conscious couples are choosing potted plants over cut flowers.',
    excerpt: 'Discover the latest wedding decoration trends taking Nepal by storm.', category: 'Wedding',
    tags: ['wedding', 'decoration', 'trends', 'nepal'], status: 'published', coverImage: '',
    author: 'Eleven Eleven Team', publishedAt: '2026-08-15', readTime: '5 min read', likes: 234, comments: 18,
    seoTitle: 'Top Wedding Decoration Trends Nepal 2026 | 11:11', seoDescription: 'Explore latest wedding decoration trends in Nepal for 2026.', seoKeywords: 'wedding decoration nepal, wedding trends 2026',
  },
  {
    id: '2', title: 'How to Plan the Perfect Birthday Party in Kathmandu', slug: 'plan-perfect-birthday-party-kathmandu',
    content: '## Step 1: Choose Your Theme\n\nWhether classic elegance or tropical paradise — having a clear theme makes decisions easier.\n\n## Step 2: Pick the Right Venue\n\nKathmandu offers everything from cozy restaurants to grand banquet halls.\n\n## Step 3: Decoration is Key\n\nFrom balloon arrangements to themed stage setups.',
    excerpt: 'Complete guide to planning the perfect birthday party in Kathmandu.', category: 'Birthday',
    tags: ['birthday', 'party', 'planning', 'kathmandu'], status: 'published', coverImage: '',
    author: 'Eleven Eleven Team', publishedAt: '2026-08-10', readTime: '4 min read', likes: 156, comments: 12,
    seoTitle: 'Birthday Party Planning Guide Kathmandu | 11:11', seoDescription: 'Step-by-step birthday party planning guide for Nepal.', seoKeywords: 'birthday party planning nepal',
  },
  {
    id: '3', title: 'Pasni Ceremony Decoration Ideas & Planning Guide', slug: 'pasni-ceremony-decoration-ideas',
    content: '## Traditional Pasni Decor\n\nThe pasni ceremony is one of the most important events in a Nepali child\'s life. Here are beautiful decoration ideas.\n\n## Modern Touches\n\nBlending tradition with contemporary aesthetics.',
    excerpt: 'Beautiful decoration ideas for the traditional Nepali pasni ceremony.', category: 'Pasni',
    tags: ['pasni', 'ceremony', 'decoration', 'nepali'], status: 'published', coverImage: '',
    author: 'Eleven Eleven Team', publishedAt: '2026-08-05', readTime: '3 min read', likes: 89, comments: 8,
    seoTitle: 'Pasni Ceremony Decoration Ideas | 11:11', seoDescription: 'Beautiful pasni ceremony decoration ideas and planning tips.', seoKeywords: 'pasni decoration, rice feeding ceremony nepal',
  },
];

// ---- LOCAL STORAGE HELPERS ----

const STORAGE_KEYS = {
  destinations: '1111_admin_destinations',
  services: '1111_admin_services',
  blogPosts: '1111_admin_blog_posts',
  packages: '1111_admin_packages',
  gallery: '1111_admin_gallery',
} as const;

function getFromStorage<T>(key: string, defaults: T): T {
  if (typeof window === 'undefined') return defaults;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
}

function setToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently fail
  }
}

// ---- DESTINATIONS ----

export function getDestinations(): AdminStoreDestination[] {
  return getFromStorage(STORAGE_KEYS.destinations, defaultDestinations);
}

export function saveDestinations(destinations: AdminStoreDestination[]): void {
  setToStorage(STORAGE_KEYS.destinations, destinations);
}

export function getFeaturedDestinationsFromStore(): AdminStoreDestination[] {
  return getDestinations().filter(d => d.featured && d.active);
}

// ---- SERVICES ----

export function getServices(): AdminStoreService[] {
  return getFromStorage(STORAGE_KEYS.services, defaultServices);
}

export function saveServices(services: AdminStoreService[]): void {
  setToStorage(STORAGE_KEYS.services, services);
}

// ---- BLOG ----

export function getBlogPosts(): AdminStoreBlog[] {
  return getFromStorage(STORAGE_KEYS.blogPosts, defaultBlogPosts);
}

export function saveBlogPosts(posts: AdminStoreBlog[]): void {
  setToStorage(STORAGE_KEYS.blogPosts, posts);
}

export function getBlogPostBySlug(slug: string): AdminStoreBlog | undefined {
  return getBlogPosts().find(p => p.slug === slug);
}

// ---- PACKAGES ----

export function getPackages(): AdminStorePackage[] {
  return getFromStorage<AdminStorePackage[]>(STORAGE_KEYS.packages, []);
}

export function savePackages(packages: AdminStorePackage[]): void {
  setToStorage(STORAGE_KEYS.packages, packages);
}

// ---- GALLERY ----

const defaultGalleryImages: AdminStoreGalleryImage[] = [
  { id: '1', url: '', title: 'Royal Wedding Mandap', description: 'Floral arch mandap setup at Soaltee Hotel Crown Plaza', category: 'Wedding', tags: ['wedding', 'mandap', 'floral'], eventType: 'wedding', featured: true, order: 1, createdAt: '2026-08-15' },
  { id: '2', url: '', title: 'Birthday Balloon Backdrop', description: 'Colorful balloon arrangement for a 5th birthday party', category: 'Birthday', tags: ['birthday', 'balloons', 'kids'], eventType: 'birthday', featured: true, order: 2, createdAt: '2026-08-12' },
  { id: '3', url: '', title: 'Pasni Ceremony Stage', description: 'Traditional pasni stage with marigold and banana leaf decor', category: 'Pasni', tags: ['pasni', 'traditional', 'stage'], eventType: 'pasni', featured: true, order: 3, createdAt: '2026-08-10' },
  { id: '4', url: '', title: 'Anniversary Dinner Setup', description: 'Romantic candlelit dinner arrangement for anniversary celebration', category: 'Anniversary', tags: ['anniversary', 'romantic', 'dinner'], eventType: 'anniversary', featured: false, order: 4, createdAt: '2026-08-08' },
  { id: '5', url: '', title: 'Haldi Mehendi Decor', description: 'Yellow and green themed haldi mehendi ceremony decoration', category: 'Haldi & Mehendi', tags: ['haldi', 'mehendi', 'pre-wedding'], eventType: 'haldi', featured: false, order: 5, createdAt: '2026-08-05' },
  { id: '6', url: '', title: 'Corporate Event Stage', description: 'Professional corporate event backdrop with LED lighting', category: 'Corporate', tags: ['corporate', 'professional', 'stage'], eventType: 'corporate', featured: false, order: 6, createdAt: '2026-08-01' },
];

export function getGalleryImages(): AdminStoreGalleryImage[] {
  return getFromStorage(STORAGE_KEYS.gallery, defaultGalleryImages);
}

export function saveGalleryImages(images: AdminStoreGalleryImage[]): void {
  setToStorage(STORAGE_KEYS.gallery, images);
}
