'use client';

import { useState, useEffect, useRef } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { ChevronLeft, ChevronRight, MapPin, Star, Users, DollarSign, Phone, Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { AdminStoreDestination } from '@/lib/store/admin-store';

const fallbackDestinations: AdminStoreDestination[] = [
  { id: '1', name: 'Hotel Shree Lekha', location: 'Thamel, Kathmandu', type: 'hotel', capacity: '50-500 guests', priceRange: 'Rs. 1,50,000 - Rs. 8,00,000', rating: 4.8, description: 'Premium hotel with state-of-the-art banquet halls and rooftop event space.', amenities: ['Banquet Hall', 'Rooftop', 'Parking', 'Catering', 'AC', 'Sound System'], featured: true, active: true, image: '', contact: '' },
  { id: '2', name: 'ChhyaChaa Banquet Hall', location: 'Jhamsikhel, Lalitpur', type: 'banquet', capacity: '30-300 guests', priceRange: 'Rs. 1,20,000 - Rs. 6,00,000', rating: 4.6, description: 'Elegant banquet halls with traditional Newari architecture and modern amenities.', amenities: ['Indoor Hall', 'Garden', 'Parking', 'Catering', 'AC'], featured: true, active: true, image: '', contact: '' },
  { id: '3', name: 'Monsoon Banquet & Lawn', location: 'Patan, Lalitpur', type: 'banquet', capacity: '40-400 guests', priceRange: 'Rs. 1,80,000 - Rs. 7,50,000', rating: 4.7, description: 'Contemporary banquet hall with stunning courtyard and premium catering.', amenities: ['Courtyard', 'Banquet Hall', 'Parking', 'Catering', 'AC', 'Pool'], featured: true, active: true, image: '', contact: '' },
  { id: '4', name: 'Classic Diamond Party Palace', location: 'Putalisadak, Kathmandu', type: 'party_palace', capacity: '60-600 guests', priceRange: 'Rs. 2,00,000 - Rs. 10,00,000', rating: 4.9, description: "Nepal's premier party palace with grand ballroom and multiple event halls.", amenities: ['Grand Ballroom', 'Multiple Halls', 'Parking', 'Catering', 'AC', 'Sound System', 'Stage'], featured: true, active: true, image: '', contact: '' },
  { id: '5', name: 'Batasia Banquet Hall', location: 'New Baneshwor, Kathmandu', type: 'banquet', capacity: '25-250 guests', priceRange: 'Rs. 80,000 - Rs. 4,00,000', rating: 4.4, description: 'Cozy banquet space with excellent food and affordable packages.', amenities: ['Banquet Hall', 'Parking', 'Catering', 'AC'], featured: false, active: true, image: '', contact: '' },
  { id: '6', name: 'Golden Gate Party Palace', location: 'Dillibazar, Kathmandu', type: 'party_palace', capacity: '30-200 guests', priceRange: 'Rs. 60,000 - Rs. 3,00,000', rating: 4.3, description: 'Budget-friendly party venue with great food and flexible setup.', amenities: ['Indoor Hall', 'Private Room', 'Catering', 'AC'], featured: false, active: true, image: '', contact: '' },
  { id: '7', name: 'Hotel Jhaptek', location: 'Maharajgunj, Kathmandu', type: 'hotel', capacity: '40-350 guests', priceRange: 'Rs. 1,30,000 - Rs. 5,50,000', rating: 4.5, description: 'Well-appointed hotel with modern facilities and professional event management.', amenities: ['Banquet Hall', 'Lawn', 'Parking', 'Catering', 'AC', 'Sound System'], featured: false, active: true, image: '', contact: '' },
  { id: '8', name: 'Gorkha Kulfi Restaurant', location: 'Boudha, Kathmandu', type: 'hotel', capacity: '20-100 guests', priceRange: 'Rs. 30,000 - Rs. 1,50,000', rating: 4.2, description: 'Quaint venue near Boudhanath Stupa, perfect for intimate gatherings.', amenities: ['Outdoor Seating', 'Catering', 'Cultural Ambiance'], featured: false, active: true, image: '', contact: '' },
  { id: '9', name: 'Hotel Jhanki', location: 'Lagankhel, Lalitpur', type: 'hotel', capacity: '35-300 guests', priceRange: 'Rs. 1,00,000 - Rs. 4,50,000', rating: 4.4, description: 'Traditional hospitality meets modern amenities with excellent banquet facilities.', amenities: ['Banquet Hall', 'Garden', 'Parking', 'Catering', 'AC'], featured: false, active: true, image: '', contact: '' },
  { id: '10', name: 'Rare Haven Banquet', location: 'Sanepa, Lalitpur', type: 'banquet', capacity: '25-200 guests', priceRange: 'Rs. 90,000 - Rs. 3,80,000', rating: 4.5, description: 'Boutique banquet space with stunning decor and personalized service.', amenities: ['Indoor/Outdoor', 'Catering', 'AC', 'Decor Included'], featured: false, active: true, image: '', contact: '' },
];

const typeLabels: Record<string, { label: string; emoji: string; color: string }> = {
  hotel: { label: 'Hotel', emoji: '🏨', color: 'bg-blue-500/10 text-blue-400' },
  banquet: { label: 'Banquet Hall', emoji: '🎪', color: 'bg-purple-500/10 text-purple-400' },
  party_palace: { label: 'Party Palace', emoji: '🎉', color: 'bg-orange-500/10 text-orange-400' },
  restaurant: { label: 'Restaurant', emoji: '🍽️', color: 'bg-green-500/10 text-green-400' },
};

const getPriceBounds = (priceRange: string) => {
  const prices = priceRange.match(/\d[\d,]*/g)?.map(price => Number(price.replace(/,/g, ''))) ?? [];
  return { min: prices[0] ?? 0, max: prices[prices.length - 1] ?? 0 };
};

const getMaximumGuests = (capacity: string) => {
  const guests = capacity.match(/\d[\d,]*/g)?.map(value => Number(value.replace(/,/g, ''))) ?? [];
  return guests[guests.length - 1] ?? 0;
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<AdminStoreDestination[]>(fallbackDestinations);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [guests, setGuests] = useState('');
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);
  const featuredSliderRef = useRef<HTMLDivElement>(null);

  const scrollFeatured = (direction: 'left' | 'right') => {
    const slider = featuredSliderRef.current;
    if (!slider) return;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const nextScroll = direction === 'right'
      ? slider.scrollLeft + slider.clientWidth
      : slider.scrollLeft - slider.clientWidth;
    const targetScroll = direction === 'right' && nextScroll >= maxScroll - 1
      ? 0
      : direction === 'left' && nextScroll <= 0
        ? maxScroll
        : nextScroll;

    slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('/api/destinations')
      .then(async response => {
        const result = await response.json();
        if (response.ok && result.destinations?.length) setDestinations(result.destinations);
      })
  }, []);

  const activeDestinations = destinations.filter(d => d.active).sort((a, b) => (a.order ?? Number(a.id)) - (b.order ?? Number(b.id)));
  const filtered = activeDestinations.filter(destination => {
    const price = getPriceBounds(destination.priceRange);
    const searchText = `${destination.name} ${destination.description}`.toLowerCase();
    const matchesSearch = !search.trim() || searchText.includes(search.trim().toLowerCase());
    const matchesLocation = !location.trim() || destination.location.toLowerCase().includes(location.trim().toLowerCase());
    const matchesType = filter === 'all' || destination.type === filter;
    const matchesMinPrice = !minPrice || price.max >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || price.min <= Number(maxPrice);
    const matchesGuests = !guests || getMaximumGuests(destination.capacity) >= Number(guests);

    return matchesSearch && matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice && matchesGuests;
  });
  const featured = filtered.filter(d => d.featured);
  const all = filtered.filter(d => !d.featured || filter !== 'all');
  const hasActiveFilters = Boolean(search || location || minPrice || maxPrice || guests || filter !== 'all');

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setGuests('');
    setFilter('all');
  };

  useEffect(() => {
    if (filter !== 'all' || featured.length < 2 || isFeaturedPaused) return;

    const interval = window.setInterval(() => {
      scrollFeatured('right');
    }, 3000);

    return () => window.clearInterval(interval);
  }, [filter, featured.length, isFeaturedPaused]);

  return (
    <CustomerLayout>
      {/* Hero */}
      <section className="relative py-20 bg-surface-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold font-display text-cream-contrast mb-4">
            Our <span className="text-primary">Venues</span> & Destinations
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Discover the perfect venue for your celebration. From grand ballrooms to intimate restaurants, we partner with the best venues across Nepal.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-outline-variant bg-surface-container p-5 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold text-cream-contrast">
                <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
                Filter Venues
              </h2>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="text-xs font-medium text-primary hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Search</span>
                <span className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" aria-hidden="true" />
                  <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Venue name..." className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 pl-9 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary" />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Location</span>
                <input value={location} onChange={event => setLocation(event.target.value)} placeholder="Kathmandu, Lalitpur..." className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary" />
              </label>

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-on-surface">Venue type</legend>
                <div className="space-y-2">
                  {[{ key: 'all', label: 'All venues' }, ...Object.entries(typeLabels).map(([key, value]) => ({ key, label: value.label }))].map(option => (
                    <label key={option.key} className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
                      <input type="radio" name="venue-type" value={option.key} checked={filter === option.key} onChange={() => setFilter(option.key)} className="accent-primary" />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <span className="mb-2 block text-sm font-medium text-on-surface">Price range (Rs.)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="0" value={minPrice} onChange={event => setMinPrice(event.target.value)} placeholder="Min" aria-label="Minimum price" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary" />
                  <input type="number" min="0" value={maxPrice} onChange={event => setMaxPrice(event.target.value)} placeholder="Max" aria-label="Maximum price" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary" />
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-on-surface">Guests</span>
                <input type="number" min="1" value={guests} onChange={event => setGuests(event.target.value)} placeholder="Minimum capacity" className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary" />
              </label>
            </div>
          </aside>

          <div className="min-w-0">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container p-10 text-center">
                <h2 className="text-lg font-semibold text-cream-contrast">No venues found</h2>
                <p className="mt-2 text-sm text-on-surface-variant">Try adjusting your filters to see more destinations.</p>
                <button type="button" onClick={clearFilters} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">
                  Clear filters
                </button>
              </div>
            )}

      {/* Featured Venues */}
      {featured.length > 0 && filter === 'all' && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold font-display text-cream-contrast">
              <span className="text-primary">★</span> Featured Venues
            </h2>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                aria-label="Previous featured venue"
                onClick={() => scrollFeatured('left')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next featured venue"
                onClick={() => scrollFeatured('right')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            ref={featuredSliderRef}
            onMouseEnter={() => setIsFeaturedPaused(true)}
            onMouseLeave={() => setIsFeaturedPaused(false)}
            onFocus={() => setIsFeaturedPaused(true)}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsFeaturedPaused(false);
            }}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-none"
          >
            {featured.map((dest) => (
              <div key={dest.id} className="w-[calc((100%-1.5rem)/2)] flex-none snap-start bg-surface-container border border-outline-variant rounded-2xl overflow-hidden hover:border-primary/30 transition-all group lg:w-[calc((100%-3rem)/3)]">
                <div className="h-56 bg-surface-container-high flex items-center justify-center relative overflow-hidden">
                  {dest.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-3 pt-10">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          <span className="truncate">{dest.location}</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center z-10">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-on-surface-variant">{dest.location}</p>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary text-on-primary text-xs font-bold px-3 py-1 rounded-full">
                    ★ Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-cream-contrast group-hover:text-primary transition-colors">{dest.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`hidden text-xs px-2 py-0.5 rounded-full md:inline-flex ${typeLabels[dest.type]?.color || 'bg-surface-container-high text-on-surface-variant'}`}>
                          {typeLabels[dest.type]?.emoji} {typeLabels[dest.type]?.label || dest.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star className="w-3 h-3 fill-current" /> {dest.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="hidden text-sm text-on-surface-variant mb-4 line-clamp-2 md:block">{dest.description}</p>
                  <div className="hidden flex-wrap gap-2 mb-4 md:flex">
                    {dest.amenities.slice(0, 5).map((a) => (
                      <span key={a} className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-lg">{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-on-surface-variant">
                      <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {dest.capacity}</span>
                      <span className="hidden items-center gap-1 text-primary font-medium md:flex"><DollarSign className="w-4 h-4" /> {dest.priceRange}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link href="/planner" className="flex-1 text-center bg-primary text-on-primary py-2.5 rounded-xl font-semibold hover:bg-primary-fixed transition-colors text-sm">
                      Plan Event Here
                    </Link>
                    <a href="tel:+9779847411305" className="hidden items-center gap-1 border border-outline px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm md:flex">
                      <Phone className="w-4 h-4" /> Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Venues */}
      <section className={`py-16 ${featured.length > 0 ? 'bg-surface-container' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          {featured.length > 0 && <h2 className="text-2xl font-bold font-display text-cream-contrast mb-8">All Venues</h2>}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {(featured.length > 0 ? all : filtered).map((dest) => (
              <div key={dest.id} className="bg-surface border border-outline-variant rounded-2xl overflow-hidden hover:border-primary/30 transition-all group">
                <div className="relative h-40 bg-surface-container-high flex items-center justify-center overflow-hidden">
                  {dest.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-2.5 pt-8">
                        <p className="flex items-center gap-1 text-xs font-medium text-white">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="truncate">{dest.location}</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <MapPin className="w-10 h-10 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-cream-contrast group-hover:text-primary transition-colors text-sm">{dest.name}</h3>
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <Star className="w-3 h-3 fill-current" /> {dest.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1"><MapPin className="w-3 h-3" /> {dest.location}</span>
                    <span className={`hidden text-[10px] px-1.5 py-0.5 rounded-full md:inline-flex ${typeLabels[dest.type]?.color || 'bg-surface-container-high text-on-surface-variant'}`}>
                      {typeLabels[dest.type]?.emoji} {typeLabels[dest.type]?.label || dest.type}
                    </span>
                  </div>
                  <p className="hidden text-xs text-on-surface-variant mb-3 line-clamp-2 md:block">{dest.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant flex items-center gap-1"><Users className="w-3 h-3" /> {dest.capacity}</span>
                    <span className="hidden text-primary font-medium md:inline">{dest.priceRange}</span>
                  </div>
                  <Link href="/planner" className="mt-3 block text-center bg-surface-container-high text-on-surface py-2 rounded-xl text-sm font-medium hover:bg-primary hover:text-on-primary transition-colors">
                    Plan Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold font-display text-cream-contrast mb-3">Can&apos;t find the perfect venue?</h3>
          <p className="text-on-surface-variant mb-6 max-w-lg mx-auto">Our team will help you discover hidden gems and negotiate the best deals at any venue in Nepal.</p>
          <div className="flex justify-center gap-4">
            <Link href="/contact" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary-fixed transition-colors">Contact Us</Link>
            <Link href="/planner" className="border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-on-primary transition-colors">Start Planning</Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
