'use client';

import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { X, ChevronLeft, ChevronRight, ZoomIn, Heart, Share2 } from 'lucide-react';
import { getGalleryImages, type AdminStoreGalleryImage } from '@/lib/store/admin-store';

const fallbackImages: AdminStoreGalleryImage[] = [
  { id: '1', url: '', title: 'Royal Wedding Mandap', description: 'Floral arch mandap setup at Soaltee Hotel Crown Plaza', category: 'Wedding', tags: ['wedding', 'mandap', 'floral'], eventType: 'wedding', featured: true, order: 1, createdAt: '2026-08-15' },
  { id: '2', url: '', title: 'Birthday Balloon Backdrop', description: 'Colorful balloon arrangement for a 5th birthday party', category: 'Birthday', tags: ['birthday', 'balloons', 'kids'], eventType: 'birthday', featured: true, order: 2, createdAt: '2026-08-12' },
  { id: '3', url: '', title: 'Pasni Ceremony Stage', description: 'Traditional pasni stage with marigold and banana leaf decor', category: 'Pasni', tags: ['pasni', 'traditional', 'stage'], eventType: 'pasni', featured: true, order: 3, createdAt: '2026-08-10' },
  { id: '4', url: '', title: 'Anniversary Dinner Setup', description: 'Romantic candlelit dinner arrangement for anniversary celebration', category: 'Anniversary', tags: ['anniversary', 'romantic', 'dinner'], eventType: 'anniversary', featured: false, order: 4, createdAt: '2026-08-08' },
  { id: '5', url: '', title: 'Haldi Mehendi Decor', description: 'Yellow and green themed haldi mehendi ceremony decoration', category: 'Haldi & Mehendi', tags: ['haldi', 'mehendi', 'pre-wedding'], eventType: 'haldi', featured: false, order: 5, createdAt: '2026-08-05' },
  { id: '6', url: '', title: 'Corporate Event Stage', description: 'Professional corporate event backdrop with LED lighting', category: 'Corporate', tags: ['corporate', 'professional', 'stage'], eventType: 'corporate', featured: false, order: 6, createdAt: '2026-08-01' },
];

const categoryEmojis: Record<string, string> = {
  'All': '✨',
  'Wedding': '💒',
  'Birthday': '🎂',
  'Pasni': '👶',
  'Anniversary': '💕',
  'Haldi & Mehendi': '🌼',
  'Corporate': '🏢',
  'Other': '📷',
};

export default function GalleryPage() {
  const [images, setImages] = useState<AdminStoreGalleryImage[]>(fallbackImages);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = getGalleryImages();
    if (stored.length > 0) setImages(stored);
    setLoaded(true);
  }, []);

  const filtered = filter === 'All' ? images : images.filter(img => img.category === filter);
  const featured = images.filter(img => img.featured);

  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);

  const nextImage = () => {
    if (lightbox !== null) setLightbox((lightbox + 1) % filtered.length);
  };
  const prevImage = () => {
    if (lightbox !== null) setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  };

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Hero */}
        <section className="relative py-20 bg-surface-container overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="max-w-7xl mx-auto px-4 relative">
            <h1 className="text-4xl md:text-5xl font-extrabold font-display text-cream-contrast mb-4">
              Our <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl">
              Explore our collection of beautifully executed events. Every photo tells a story of celebration, creativity, and perfection.
            </p>
          </div>
        </section>

        {/* Featured Carousel */}
        {featured.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-bold font-display text-cream-contrast mb-6 flex items-center gap-2">
              <span className="text-primary">★</span> Featured Work
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {featured.map((img) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(filtered.findIndex(f => f.id === img.id))}
                  className="flex-shrink-0 w-80 aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group snap-start relative"
                >
                  {img.url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl block mb-2">{categoryEmojis[img.category] || '📷'}</span>
                        <p className="text-sm font-semibold text-cream-contrast">{img.title}</p>
                        <p className="text-xs text-on-surface-variant">{img.category}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <p className="text-white font-semibold text-sm">{img.title}</p>
                    <p className="text-white/70 text-xs">{img.description}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">★ Featured</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.entries(categoryEmojis).map(([cat, emoji]) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-cream-contrast hover:border-primary/30'
                }`}
              >
                <span>{emoji}</span> {cat}
                {cat !== 'All' && (
                  <span className="text-xs opacity-60">({images.filter(i => i.category === cat).length})</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry Grid */}
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div
                key={img.id}
                className="break-inside-avoid group cursor-pointer relative rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
                onClick={() => openLightbox(i)}
              >
                {img.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.url} alt={img.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className={`w-full ${i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/2]'} bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center`}>
                    <div className="text-center p-6">
                      <span className="text-5xl block mb-3">{categoryEmojis[img.category] || '📷'}</span>
                      <p className="text-sm font-semibold text-cream-contrast">{img.title}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{img.description}</p>
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{img.title}</p>
                      <p className="text-white/60 text-xs">{img.category} · {img.createdAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(img.id); }} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                        <Heart className={`w-4 h-4 ${liked.has(img.id) ? 'text-red-400 fill-current' : 'text-white'}`} />
                      </button>
                      <button onClick={(e) => e.stopPropagation()} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-6xl block mb-4">📷</span>
              <p className="text-on-surface-variant text-lg mb-2">No photos in this category yet</p>
              <p className="text-on-surface-variant/60 text-sm">Upload photos from the admin panel to see them here.</p>
            </div>
          )}
        </section>

        {/* Lightbox */}
        {lightbox !== null && filtered[lightbox] && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={closeLightbox}>
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-4 right-4 p-3 text-white/70 hover:text-white transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full hover:bg-white/20">
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full hover:bg-white/20">
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="max-w-5xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
              {filtered[lightbox].url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={filtered[lightbox].url} alt={filtered[lightbox].title} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
              ) : (
                <div className="w-[600px] h-[400px] bg-surface-container rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl block mb-3">{categoryEmojis[filtered[lightbox].category] || '📷'}</span>
                    <p className="text-lg font-semibold text-cream-contrast">{filtered[lightbox].title}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{filtered[lightbox].description}</p>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="mt-4 text-center">
                <h3 className="text-white font-semibold text-lg">{filtered[lightbox].title}</h3>
                <p className="text-white/60 text-sm mt-1">{filtered[lightbox].description}</p>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <span className="text-xs text-white/40 px-2 py-1 bg-white/10 rounded-full">{filtered[lightbox].category}</span>
                  <span className="text-xs text-white/40">{filtered[lightbox + 1] ? `${lightbox + 1} / ${filtered.length}` : ''}</span>
                  <button onClick={() => toggleLike(filtered[lightbox].id)} className="flex items-center gap-1 text-xs text-white/60 hover:text-red-400 transition-colors">
                    <Heart className={`w-3.5 h-3.5 ${liked.has(filtered[lightbox].id) ? 'text-red-400 fill-current' : ''}`} /> Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </CustomerLayout>
  );
}
