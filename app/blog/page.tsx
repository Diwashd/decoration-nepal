'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AnimatedSection from '@/components/customer/AnimatedSection';
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { getBlogPosts, type AdminStoreBlog } from '@/lib/store/admin-store';

// Mock blog data - will be replaced with API calls
const mockPosts = [
  {
    id: '1',
    title: 'Top 10 Wedding Decoration Trends in Nepal for 2026',
    slug: 'wedding-decoration-trends-nepal-2026',
    excerpt: 'Discover the latest wedding decoration trends that are taking Nepal by storm. From floral arches to minimalist mandaps, here\'s what\'s hot.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-08-15',
    category: 'Wedding',
    tags: ['wedding', 'decoration', 'trends', 'nepal'],
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'How to Plan the Perfect Birthday Party in Kathmandu',
    slug: 'plan-perfect-birthday-party-kathmandu',
    excerpt: 'Planning a birthday party? Here\'s our complete guide to organizing an unforgettable celebration in Kathmandu.',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-08-10',
    category: 'Birthday',
    tags: ['birthday', 'party', 'planning', 'kathmandu'],
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'Traditional Pasni Ceremony: Decoration Ideas & Guide',
    slug: 'pasni-ceremony-decoration-ideas',
    excerpt: 'Honor tradition with beautiful Pasni ceremony decorations. Explore ideas that blend cultural richness with modern aesthetics.',
    coverImage: 'https://images.unsplash.com/photo-1545232906-ddfd367fe86a?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-08-05',
    category: 'Pasni',
    tags: ['pasni', 'ceremony', 'traditional', 'decoration'],
    readTime: '6 min read',
  },
  {
    id: '4',
    title: 'Choosing the Right Venue: Party Palaces vs Hotels in Nepal',
    slug: 'choosing-venue-party-palaces-vs-hotels',
    excerpt: 'Should you book a party palace or a hotel for your event? We break down the pros and cons of each option in Nepal.',
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-07-28',
    category: 'Tips',
    tags: ['venue', 'party palace', 'hotel', 'planning'],
    readTime: '7 min read',
  },
  {
    id: '5',
    title: 'Anniversary Celebration Ideas: Make It Special',
    slug: 'anniversary-celebration-ideas',
    excerpt: 'Celebrate your love story with these romantic anniversary decoration and setup ideas. From intimate dinners to grand parties.',
    coverImage: 'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-07-20',
    category: 'Anniversary',
    tags: ['anniversary', 'celebration', 'romantic', 'ideas'],
    readTime: '5 min read',
  },
  {
    id: '6',
    title: 'Haldi & Mehendi: Colorful Pre-Wedding Celebration Guide',
    slug: 'haldi-mehendi-pre-wedding-guide',
    excerpt: 'Everything you need to know about organizing vibrant Haldi and Mehendi ceremonies in Nepal. Decor, dress code, and more.',
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=800&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    publishedAt: '2026-07-15',
    category: 'Wedding',
    tags: ['haldi', 'mehendi', 'pre-wedding', 'ceremony'],
    readTime: '6 min read',
  },
];

const categories = ['All', 'Wedding', 'Birthday', 'Pasni', 'Anniversary', 'Tips', 'Haldi & Mehendi'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState<AdminStoreBlog[]>(mockPosts as any);

  useEffect(() => {
    const stored = getBlogPosts();
    if (stored.length > 0) setPosts(stored);
  }, []);

  const filteredPosts = selectedCategory === 'All'
    ? posts.filter(p => p.status === 'published')
    : posts.filter((p) => p.category === selectedCategory && p.status === 'published');

  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Hero */}
        <section className="relative py-24 px-6 lg:px-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto relative z-10">
            <AnimatedSection>
              <div className="max-w-3xl">
                <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-4">
                  <span className="w-8 h-px bg-primary"></span> Blog
                </span>
                <h1 className="font-display text-cream-contrast text-4xl md:text-6xl font-bold mb-6">
                  Latest News & <span className="text-primary italic">Updates</span>
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                  Tips, guides, and inspiration for your next event. Stay updated with the latest trends in event decoration in Nepal.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 lg:px-20 pb-8 bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <AnimatedSection delay={100}>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-cream-contrast border border-outline-variant'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="px-6 lg:px-20 pb-24 bg-surface">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 100}>
                  <Link href={`/blog/${post.slug}`} className="group block bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
                    {/* Cover Image */}
                    <div className="relative h-52 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${post.coverImage}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container/80 backdrop-blur-md border border-outline-variant/30">
                        <span className="text-xs font-bold text-primary">{post.category}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h2 className="font-display text-cream-contrast text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-on-surface-variant text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                        <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
    </CustomerLayout>
  );
}
