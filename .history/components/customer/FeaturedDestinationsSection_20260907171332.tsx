'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedSection from '@/components/customer/AnimatedSection';
import type { AdminStoreDestination } from '@/lib/store/admin-store';

const fallbackFeatured: AdminStoreDestination[] = [
  { id: '1', name: 'Hotel Shree Lekha', location: 'Thamel, Kathmandu', type: 'hotel', capacity: '50-500 guests', priceRange: 'Rs. 1,50,000+', rating: 4.8, description: 'Premium hotel with state-of-the-art banquet halls and rooftop event space.', amenities: ['Banquet Hall', 'Rooftop', 'Parking', 'Catering', 'AC'], featured: true, active: true, image: '', contact: '' },
  { id: '2', name: 'ChhyaChaa Banquet Hall', location: 'Jhamsikhel, Lalitpur', type: 'banquet', capacity: '30-300 guests', priceRange: 'Rs. 1,20,000+', rating: 4.6, description: 'Elegant halls with traditional Newari architecture and modern amenities.', amenities: ['Indoor Hall', 'Garden', 'Parking', 'Catering', 'AC'], featured: true, active: true, image: '', contact: '' },
  { id: '3', name: 'Monsoon Banquet & Lawn', location: 'Patan, Lalitpur', type: 'banquet', capacity: '40-400 guests', priceRange: 'Rs. 1,80,000+', rating: 4.7, description: 'Contemporary banquet hall with stunning courtyard and premium catering.', amenities: ['Courtyard', 'Banquet Hall', 'Parking', 'Catering', 'AC', 'Pool'], featured: true, active: true, image: '', contact: '' },
  { id: '4', name: 'Classic Diamond Party Palace', location: 'Putalisadak, Kathmandu', type: 'party_palace', capacity: '60-600 guests', priceRange: 'Rs. 2,00,000+', rating: 4.9, description: 'Nepal\'s premier party palace with grand ballroom and multiple event halls.', amenities: ['Grand Ballroom', 'Multiple Halls', 'Parking', 'Catering', 'AC', 'Sound System', 'Stage'], featured: true, active: true, image: '', contact: '' },
];

const typeConfig: Record<string, { label: string; emoji: string; color: string }> = {
  hotel: { label: 'Hotel', emoji: '🏨', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  banquet: { label: 'Banquet', emoji: '🎪', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  party_palace: { label: 'Party Palace', emoji: '🎉', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  restaurant: { label: 'Restaurant', emoji: '🍽️', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

export default function FeaturedDestinationsSection() {
  const [featured, setFeatured] = useState<AdminStoreDestination[]>(fallbackFeatured);

  useEffect(() => {
    fetch('/api/destinations')
      .then(async response => {
        const result = await response.json();
        if (response.ok && result.destinations?.length) setFeatured(result.destinations.filter((destination: AdminStoreDestination) => destination.featured));
      });
  }, []);

  return (
    <section className="py-24 px-6 lg:px-20 bg-surface relative">
      <div className="max-w-[1280px] mx-auto">
        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase block mb-4 flex items-center gap-4">
                <span className="w-8 h-px bg-primary"></span> Our Partner Venues
              </span>
              <h2 className="font-display text-cream-contrast text-4xl md:text-5xl font-semibold">Featured <span className="text-primary">Destinations</span></h2>
              <p className="text-on-surface-variant max-w-xl mt-3">
                We&apos;ve curated exclusive partnerships with Nepal&apos;s finest venues — ensuring your event is hosted in unparalleled settings.
              </p>
            </div>
            <Link href="/destinations" className="text-primary text-xs font-bold uppercase tracking-widest hover:text-primary-fixed transition-colors flex items-center gap-2 pb-2 border-b border-primary/30 hover:border-primary whitespace-nowrap">
              View All Venues →
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((dest, i) => {
            const tc = typeConfig[dest.type] || typeConfig.hotel;
            return (
              <AnimatedSection key={dest.id} delay={i * 100}>
                <div className="group bg-surface-container-high border-[0.5px] border-outline-variant/30 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Image area */}
                  <div className="relative h-48 overflow-hidden">
                    {dest.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="text-5xl">{tc.emoji}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent"></div>
                    {dest.featured && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                        ★ Featured
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${tc.color}`}>
                        {tc.emoji} {tc.label}
                      </span>
                      <span className="text-[10px] text-yellow-400 font-semibold">★ {dest.rating}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-cream-contrast group-hover:text-primary transition-colors mb-1 truncate">{dest.name}</h3>
                    <p className="text-xs text-on-surface-variant mb-3 flex items-center gap-1">
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {dest.location}
                    </p>
                    <p className="text-xs text-on-surface-variant/70 line-clamp-2 mb-3">{dest.description}</p>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-on-surface-variant">{dest.capacity}</span>
                      <span className="text-primary font-medium">{dest.priceRange}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href="/planner" className="flex-1 text-center text-xs font-semibold py-2 px-3 rounded-lg bg-primary text-on-primary hover:bg-primary-fixed transition-colors">
                        Plan Event
                      </Link>
                      <Link href="/destinations" className="text-xs font-semibold py-2 px-3 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
