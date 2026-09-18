'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Star, Users, ChevronRight, ExternalLink } from 'lucide-react';
import { getFeaturedDestinations, FeaturedDestination } from '@/lib/data/featured-destinations';

export default function FeaturedDestinationsSidebar() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const featured = getFeaturedDestinations().slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Featured Destinations */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-5 border-b border-outline-variant">
          <h3 className="font-display font-bold text-cream-contrast text-lg flex items-center gap-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary text-sm">★</span>
            Featured Venues
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">Our top partner destinations</p>
        </div>

        <div className="p-4 space-y-3">
          {featured.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-xl border border-outline-variant/50 overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Venue Header */}
              <button
                onClick={() => setExpanded(expanded === dest.id ? null : dest.id)}
                className="w-full text-left p-4 flex items-start gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-cream-contrast group-hover:text-primary transition-colors truncate">
                    {dest.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {dest.location}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-yellow-400 flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-current" /> {dest.rating}
                    </span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-0.5">
                      <Users className="w-3 h-3" /> {dest.capacity}
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-on-surface-variant transition-transform ${expanded === dest.id ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded Content */}
              {expanded === dest.id && (
                <div className="px-4 pb-4 border-t border-outline-variant/30">
                  <p className="text-xs text-on-surface-variant mt-3 mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold">{dest.priceRange}</span>
                    <div className="flex gap-2">
                      <Link
                        href="/planner"
                        className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded-lg font-medium hover:bg-primary-fixed transition-colors"
                      >
                        Plan Event
                      </Link>
                      <a
                        href="tel:+9779847411305"
                        className="text-xs border border-outline text-on-surface-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-outline-variant/30">
          <Link
            href="/destinations"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-container font-semibold transition-colors py-2"
          >
            View All Venues <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Quick CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 text-center">
        <p className="text-2xl mb-2">🎉</p>
        <h4 className="font-display font-bold text-cream-contrast mb-1">Planning an Event?</h4>
        <p className="text-xs text-on-surface-variant mb-3">Get a free consultation and venue recommendation.</p>
        <Link
          href="/planner"
          className="block w-full bg-primary text-on-primary py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-fixed transition-colors"
        >
          Start Planning →
        </Link>
      </div>

      {/* Popular Posts */}
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-5">
        <h3 className="font-display font-bold text-cream-contrast mb-4 text-sm">Popular Articles</h3>
        <div className="space-y-3">
          {[
            { title: 'Wedding Decoration Trends 2026', slug: 'wedding-decoration-trends-nepal-2026', date: 'Aug 15, 2026' },
            { title: 'Birthday Party Planning Guide', slug: 'plan-perfect-birthday-party-kathmandu', date: 'Aug 10, 2026' },
            { title: 'Pasni Ceremony Decoration Ideas', slug: 'pasni-ceremony-decoration-ideas', date: 'Aug 5, 2026' },
          ].map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container-high transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <span className="text-sm">📖</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-cream-contrast group-hover:text-primary transition-colors truncate">{post.title}</p>
                <p className="text-xs text-on-surface-variant">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
