// Featured destinations managed from admin panel
// These are the destinations shown on homepage and blog sidebar

export interface FeaturedDestination {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  rating: number;
  capacity: string;
  priceRange: string;
  featured: boolean;
  type: 'hotel' | 'banquet' | 'party_palace';
}

export const allDestinations: FeaturedDestination[] = [
  { id: '1', name: 'Hotel Shree Lekha', location: 'Thamel, Kathmandu', image: '', description: 'Premium hotel with state-of-the-art banquet halls and rooftop event space.', rating: 4.8, capacity: '50-500 guests', priceRange: 'Rs. 1,50,000+', featured: true, type: 'hotel' },
  { id: '2', name: 'ChhyaChaa Banquet Hall', location: 'Jhamsikhel, Lalitpur', image: '', description: 'Elegant halls with traditional Newari architecture and modern amenities.', rating: 4.6, capacity: '30-300 guests', priceRange: 'Rs. 1,20,000+', featured: true, type: 'banquet' },
  { id: '3', name: 'Monsoon Banquet & Lawn', location: 'Patan, Lalitpur', image: '', description: 'Contemporary banquet hall with stunning courtyard and premium catering.', rating: 4.7, capacity: '40-400 guests', priceRange: 'Rs. 1,80,000+', featured: true, type: 'banquet' },
  { id: '4', name: 'Classic Diamond Party Palace', location: 'Putalisadak, Kathmandu', image: '', description: 'Premier party palace with grand ballroom and multiple event halls.', rating: 4.9, capacity: '60-600 guests', priceRange: 'Rs. 2,00,000+', featured: true, type: 'party_palace' },
  { id: '5', name: 'Batasia Banquet Hall', location: 'New Baneshwor, Kathmandu', image: '', description: 'Cozy banquet space with excellent food and affordable packages.', rating: 4.4, capacity: '25-250 guests', priceRange: 'Rs. 80,000+', featured: false, type: 'banquet' },
  { id: '6', name: 'Golden Gate Party Palace', location: 'Dillibazar, Kathmandu', image: '', description: 'Budget-friendly party venue with great food and flexible setup.', rating: 4.3, capacity: '30-200 guests', priceRange: 'Rs. 60,000+', featured: false, type: 'party_palace' },
  { id: '7', name: 'Hotel Jhaptek', location: 'Maharajgunj, Kathmandu', image: '', description: 'Modern facilities and professional event management.', rating: 4.5, capacity: '40-350 guests', priceRange: 'Rs. 1,30,000+', featured: false, type: 'hotel' },
  { id: '8', name: 'Gorkha Kulfi Restaurant', location: 'Boudha, Kathmandu', image: '', description: 'Perfect for intimate gatherings near Boudhanath Stupa.', rating: 4.2, capacity: '20-100 guests', priceRange: 'Rs. 30,000+', featured: false, type: 'hotel' },
  { id: '9', name: 'Hotel Jhanki', location: 'Lagankhel, Lalitpur', image: '', description: 'Traditional hospitality with modern banquet facilities.', rating: 4.4, capacity: '35-300 guests', priceRange: 'Rs. 1,00,000+', featured: false, type: 'hotel' },
  { id: '10', name: 'Rare Haven Banquet', location: 'Sanepa, Lalitpur', image: '', description: 'Boutique banquet space with stunning decor and personalized service.', rating: 4.5, capacity: '25-200 guests', priceRange: 'Rs. 90,000+', featured: false, type: 'banquet' },
];

// Helper to get featured destinations (used on homepage + blog sidebar)
export function getFeaturedDestinations(): FeaturedDestination[] {
  return allDestinations.filter(d => d.featured);
}

// Helper to get all destinations
export function getAllDestinations(): FeaturedDestination[] {
  return allDestinations;
}
