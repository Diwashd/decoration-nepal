'use client';

import { useEffect, useRef } from 'react';
import { X, MapPin, Users, DollarSign, Star, Phone, Mail } from 'lucide-react';
import { Venue, venueTypeLabels, venueTypeIcons } from '@/lib/data/destinations';

interface VenueModalProps {
  venue: Venue | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VenueModal({ venue, isOpen, onClose }: VenueModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !venue) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300"
      >
        {/* Hero Image */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url('${venue.image}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container/80 backdrop-blur-md border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors z-10"
          >
            <X className="w-5 h-5 text-on-surface-variant" />
          </button>

          {/* Venue Type Badge */}
          <div className="absolute top-4 left-4 px-4 py-1.5 border border-primary rounded-full bg-surface-container/80 backdrop-blur-md">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">
              {venueTypeIcons[venue.type]} {venueTypeLabels[venue.type]}
            </span>
          </div>

          {/* Venue Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <h2 className="font-display text-cream-contrast text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {venue.name}
            </h2>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{venue.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-384px)]">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-container-high rounded-lg p-4 text-center border border-outline-variant/30">
              <Users className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant mb-1">Capacity</p>
              <p className="text-sm font-bold text-cream-contrast">{venue.capacity} guests</p>
            </div>
            <div className="bg-surface-container-high rounded-lg p-4 text-center border border-outline-variant/30">
              <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant mb-1">Price Range</p>
              <p className="text-sm font-bold text-cream-contrast">{venue.priceRange}</p>
            </div>
            <div className="bg-surface-container-high rounded-lg p-4 text-center border border-outline-variant/30">
              <Star className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xs text-on-surface-variant mb-1">Partner Rating</p>
              <p className="text-sm font-bold text-cream-contrast">4.8 / 5.0</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-display text-cream-contrast text-lg font-semibold mb-3">About This Venue</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {venue.description} This stunning venue offers the perfect blend of traditional Nepali hospitality
              and modern luxury. With versatile event spaces, world-class catering, and a dedicated events team,
              it&apos;s the ideal choice for weddings, receptions, corporate galas, and milestone celebrations.
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="font-display text-cream-contrast text-lg font-semibold mb-3">Venue Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'Parking Available',
                'Air Conditioning',
                'In-house Catering',
                'AV Equipment',
                'Bridal Suite',
                'Outdoor Space',
                'Wheelchair Access',
                'Valet Service',
                'Accommodation',
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-on-surface-variant"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display text-cream-contrast font-semibold mb-1">Interested in this venue?</h4>
                <p className="text-sm text-on-surface-variant">Our team will help you book and coordinate with the venue.</p>
              </div>
              <div className="flex gap-3">
                <a
                  href="tel:+9779847411305"
                  className="flex items-center gap-2 bg-primary text-surface px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </a>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 border border-outline text-on-surface-variant px-5 py-2.5 rounded-lg hover:bg-surface-container-high transition-colors font-semibold text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
