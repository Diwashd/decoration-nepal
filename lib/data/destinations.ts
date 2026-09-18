// Real Nepali venues — party palaces, hotels, and resorts we work with

export interface Venue {
  name: string;
  type: 'party_palace' | 'hotel' | 'resort' | 'garden';
  location: string;
  capacity: string;
  priceRange: string;
  image: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  venues: Venue[];
}

export const destinations: Destination[] = [
  {
    id: 'kathmandu',
    name: 'Kathmandu Valley',
    subtitle: 'Heritage & Grandeur',
    description: 'From ancient courtyards to modern banquet halls, Kathmandu offers unmatched variety for grand celebrations.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    venues: [
      {
        name: 'Soaltee Hotel Crown Plaza',
        type: 'hotel',
        location: 'Tahachal, Kathmandu',
        capacity: '200-800',
        priceRange: 'Rs. 2,500-4,000/plate',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
        description: 'Five-star luxury with sprawling ballrooms and impeccable service.',
      },
      {
        name: 'Imperial Banquet',
        type: 'party_palace',
        location: 'New Baneshwor, Kathmandu',
        capacity: '300-1200',
        priceRange: 'Rs. 1,200-2,000/plate',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop',
        description: 'Nepal\'s most premium event venue — 22,000 sq ft of pure elegance.',
      },
      {
        name: 'Queen\'s Palace Banquet',
        type: 'party_palace',
        location: 'Kamaladi, Kathmandu',
        capacity: '200-600',
        priceRange: 'Rs. 1,000-1,800/plate',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop',
        description: 'Trusted destination for weddings, receptions, and corporate events.',
      },
      {
        name: 'Hyatt Regency Kathmandu',
        type: 'hotel',
        location: 'Baluwatar, Kathmandu',
        capacity: '150-500',
        priceRange: 'Rs. 3,000-5,000/plate',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600&auto=format&fit=crop',
        description: 'International standard luxury with stunning mountain views.',
      },
      {
        name: 'Smart Durbar Banquet',
        type: 'party_palace',
        location: 'Chabahil, Kathmandu',
        capacity: '200-500',
        priceRange: 'Rs. 1,200-1,500/plate',
        image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=600&auto=format&fit=crop',
        description: 'Ambience, food, and service that won\'t break the bank.',
      },
      {
        name: 'Lisara Receptions',
        type: 'party_palace',
        location: 'Naxal, Kathmandu',
        capacity: '150-400',
        priceRange: 'Rs. 1,000-1,600/plate',
        image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?q=80&w=600&auto=format&fit=crop',
        description: 'Where elegance meets exceptional hospitality near Naxal.',
      },
      {
        name: 'Gaganchumbi Party Palace',
        type: 'party_palace',
        location: 'Gongabu, Kathmandu',
        capacity: '250-600',
        priceRange: 'Rs. 1,000-1,500/plate',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop',
        description: 'Spacious halls perfect for grand wedding receptions.',
      },
      {
        name: 'Rani Mahal Banquet',
        type: 'party_palace',
        location: 'Putalisadak, Kathmandu',
        capacity: '200-500',
        priceRange: 'Rs. 900-1,400/plate',
        image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=600&auto=format&fit=crop',
        description: 'Royal treatment at accessible prices in the heart of the city.',
      },
    ],
  },
  {
    id: 'pokhara',
    name: 'Pokhara',
    subtitle: 'Lakeside Serenity',
    description: 'Exchange vows with the Annapurna range as your backdrop. Pokhara is Nepal\'s ultimate lakeside celebration destination.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=1200&auto=format&fit=crop',
    venues: [
      {
        name: 'Temple Tree Resort & Spa',
        type: 'resort',
        location: 'Lakeside, Pokhara',
        capacity: '100-400',
        priceRange: 'Rs. 2,000-3,500/plate',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop',
        description: 'Luxury lakeside resort with panoramic mountain views.',
      },
      {
        name: 'Pokhara Grande',
        type: 'hotel',
        location: 'Lakeside, Pokhara',
        capacity: '150-500',
        priceRange: 'Rs. 1,800-3,000/plate',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop',
        description: 'Modern luxury hotel with a stunning Phewa Lake backdrop.',
      },
      {
        name: 'Fish Tail Lodge',
        type: 'resort',
        location: 'Lakeside, Pokhara',
        capacity: '80-200',
        priceRange: 'Rs. 2,500-4,000/plate',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
        description: 'Exclusive boutique resort on a private peninsula.',
      },
      {
        name: 'Barahi Jungle Lodge',
        type: 'resort',
        location: 'Lakeside, Pokhara',
        capacity: '60-150',
        priceRange: 'Rs. 3,000-5,000/plate',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
        description: 'Wilderness luxury — intimate celebrations surrounded by nature.',
      },
      {
        name: 'Gauri Shankar Party Palace',
        type: 'party_palace',
        location: 'Mahendrapul, Pokhara',
        capacity: '200-500',
        priceRange: 'Rs. 800-1,200/plate',
        image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=600&auto=format&fit=crop',
        description: 'Popular party palace with modern facilities and mountain views.',
      },
    ],
  },
  {
    id: 'chitwan',
    name: 'Chitwan',
    subtitle: 'Wilderness Elegance',
    description: 'Experience the magic of jungle lodges and riverside resorts. Chitwan offers a one-of-a-kind celebration amidst nature.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    venues: [
      {
        name: 'Tiger Tops Jungle Lodge',
        type: 'resort',
        location: 'Chitwan National Park',
        capacity: '50-150',
        priceRange: 'Rs. 4,000-7,000/plate',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop',
        description: 'Iconic jungle lodge — luxury safaris and intimate wilderness celebrations.',
      },
      {
        name: 'Jungle Wildlife Resort',
        type: 'resort',
        location: 'Sauraha, Chitwan',
        capacity: '80-200',
        priceRange: 'Rs. 1,500-2,500/plate',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600&auto=format&fit=crop',
        description: 'Riverside resort with thatched-roof banquet spaces.',
      },
      {
        name: 'Meghauli Serai',
        type: 'resort',
        location: 'Meghauli, Chitwan',
        capacity: '40-100',
        priceRange: 'Rs. 5,000-8,000/plate',
        image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=600&auto=format&fit=crop',
        description: 'A Taj property — exclusive luxury on the Rapti River.',
      },
      {
        name: 'Chitwan Green Resort',
        type: 'resort',
        location: 'Sauraha, Chitwan',
        capacity: '100-300',
        priceRange: 'Rs. 1,000-1,800/plate',
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600&auto=format&fit=crop',
        description: 'Affordable luxury surrounded by lush tropical gardens.',
      },
    ],
  },
];

// Flat list of all venues for quick lookup
export const allVenues: (Venue & { destinationId: string })[] = destinations.flatMap(dest =>
  dest.venues.map(venue => ({ ...venue, destinationId: dest.id }))
);

// Venue type labels
export const venueTypeLabels: Record<Venue['type'], string> = {
  party_palace: 'Party Palace',
  hotel: 'Hotel',
  resort: 'Resort',
  garden: 'Garden',
};

// Venue type icons
export const venueTypeIcons: Record<Venue['type'], string> = {
  party_palace: '🏛️',
  hotel: '🏨',
  resort: '🌴',
  garden: '🌿',
};
