'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CustomerLayout from '@/components/customer/CustomerLayout';
import AnimatedSection from '@/components/customer/AnimatedSection';
import FeaturedDestinationsSidebar from '@/components/customer/FeaturedDestinationsSidebar';
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, Heart, MessageCircle, Bookmark, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/store/admin-store';
import { getWhatsAppLink } from '@/lib/utils';

const mockPosts: Record<string, any> = {
  'wedding-decoration-trends-nepal-2026': {
    title: 'Top 10 Wedding Decoration Trends in Nepal for 2026',
    excerpt: 'Discover the latest wedding decoration trends that are taking Nepal by storm.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    authorAvatar: 'EE',
    publishedAt: '2026-08-15',
    category: 'Wedding',
    tags: ['wedding', 'decoration', 'trends', 'nepal', '2026'],
    readTime: '5 min read',
    likes: 234,
    comments: 18,
    content: `\n## 1. Floral Arch Mandaps\n\nGone are the traditional rigid mandap structures. In 2026, we're seeing a beautiful shift towards organic, flowing floral arches that create a dreamy canopy. Think cascading orchids, local rhododendrons, and marigold trails.\n\n## 2. Minimalist Gold Accents\n\nThe "less is more" trend continues with subtle gold touches — thin gold frames, metallic foliage, and champagne-toned draping that adds luxury without overwhelming the space.\n\n## 3. Sustainable Decor\n\nEco-conscious couples are choosing potted plants over cut flowers, reusable fabric backdrops, and locally-sourced materials. It's beautiful and responsible.\n\n## 4. Dramatic Lighting\n\nProjection mapping, fairy light canopies, and LED-integrated floral arrangements are transforming venues into magical wonderlands after sunset.\n\n## 5. Cultural Fusion\n\nBlending Nepali traditions with modern aesthetics — think traditional dhaka fabric paired with contemporary geometric shapes, or classic marigold garlands with minimalist metal frames.\n\n## 6. Lounge-Style Reception Areas\n\nCreating cozy, living-room-style seating areas within the reception venue with plush cushions, low tables, and ambient lighting.\n\n## 7. Personalized Neon Signs\n\nCustom neon signs with couple names, wedding dates, or meaningful phrases are becoming a must-have photo backdrop element.\n\n## 8. Suspended Installations\n\nHanging floral clouds, floating candle arrangements, and suspended greenery structures that create depth and visual interest above guests.\n\n## 9. Monochromatic Palettes\n\nSticking to a single color family — all whites, all blush, or all burgundy — creates a sophisticated, editorial look.\n\n## 10. Interactive Guest Experiences\n\nPhoto booths with props, live sketching stations, and personalized favor walls that double as decor.\n\n---\n\nReady to incorporate these trends into your wedding? Contact Eleven Eleven Decoration Nepal at **+977-9847411305** or visit our [event planner](/planner) to start designing your dream wedding.\n    `,
  },
  'plan-perfect-birthday-party-kathmandu': {
    title: 'How to Plan the Perfect Birthday Party in Kathmandu',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',
    author: 'Eleven Eleven Team',
    authorAvatar: 'EE',
    publishedAt: '2026-08-10',
    category: 'Birthday',
    tags: ['birthday', 'party', 'planning', 'kathmandu'],
    readTime: '4 min read',
    likes: 156,
    comments: 12,
    content: `\nPlanning a birthday party in Kathmandu? Here's our step-by-step guide to making it unforgettable.\n\n## Step 1: Choose Your Theme\n\nWhether it's a classic elegance theme, a tropical paradise, or a superhero adventure for kids — having a clear theme makes every other decision easier.\n\n## Step 2: Pick the Right Venue\n\nKathmandu offers everything from cozy restaurants to grand banquet halls. Consider your guest count, budget, and vibe.\n\n## Step 3: Decoration is Key\n\nThis is where we come in! From balloon arrangements to themed stage setups, the right decoration transforms any space.\n\n## Step 4: Plan the Food\n\nWork with your venue or a caterer to plan a menu that matches your theme and satisfies your guests.\n\n## Step 5: Entertainment\n\nLive music, DJ, games, or activities — keep your guests engaged and entertained throughout.\n\n---\n\nContact us at **+977-9847411305** to plan your next birthday celebration!\n    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [storedPost, setStoredPost] = useState<any>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeToc, setActiveToc] = useState('');

  useEffect(() => {
    const fromStore = getBlogPostBySlug(slug);
    if (fromStore) {
      setStoredPost({
        ...fromStore,
        publishedAt: '2026-08-15',
        readTime: '5 min read',
        likes: fromStore.likes || 0,
        comments: fromStore.comments || 0,
        authorAvatar: 'EE',
      });
    }
  }, [slug]);

  const post = storedPost || mockPosts[slug];

  // Extract headings for TOC
  const headings = post?.content?.split('\n')
    .filter((line: string) => line.startsWith('## '))
    .map((line: string) => ({ id: line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-'), text: line.slice(3) })) || [];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setReadProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowScrollTop(scrollTop > 500);

      // Active TOC
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveToc(headings[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!post) {
    return (
      <CustomerLayout>
        <main className="pt-20 bg-surface min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-6xl mb-4">📝</p>
            <h1 className="text-3xl font-display font-bold text-cream-contrast mb-4">Post Not Found</h1>
            <p className="text-on-surface-variant mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blog" className="text-primary hover:text-primary-container font-semibold">← Back to Blog</Link>
          </div>
        </main>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <main className="pt-20 bg-surface min-h-screen">
        {/* Reading Progress Bar */}
        <div className="fixed top-20 left-0 w-full z-40 h-1 bg-surface-container">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-fixed transition-all duration-150"
            style={{ width: `${readProgress}%` }}
          />
        </div>

        {/* Hero Image */}
        <div className="relative h-[40vh] overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${post.coverImage}')` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        </div>

        {/* Content + Sidebar */}
        <div className="max-w-[1280px] mx-auto px-4 lg:px-20 -mt-12 relative z-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <AnimatedSection>
                <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden">
                  {/* Back Button */}
                  <div className="px-6 md:px-8 pt-4 pb-0">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary-container text-sm font-semibold transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Back to Blog
                    </Link>
                  </div>

                  {/* Article Header */}
                  <div className="p-6 md:p-8 border-b border-outline-variant/30">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{post.category}</span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                    </div>
                    <h1 className="font-display text-cream-contrast text-2xl md:text-3xl font-bold leading-tight mb-4">{post.title}</h1>

                    {/* Author + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-fixed flex items-center justify-center text-on-primary text-sm font-bold">{post.authorAvatar}</div>
                        <div>
                          <p className="text-sm font-semibold text-cream-contrast">{post.author}</p>
                          <p className="text-xs text-on-surface-variant">Decoration Expert</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${liked ? 'bg-red-500/10 text-red-400' : 'bg-surface-container-high text-on-surface-variant hover:text-red-400'}`}>
                          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} /> {post.likes + (liked ? 1 : 0)}
                        </button>
                        <button onClick={() => setBookmarked(!bookmarked)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${bookmarked ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'}`}>
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} /> Save
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="p-6 md:p-8">
                    <div className="text-on-surface-variant leading-relaxed">
                      {post.content.split('\n').map((line: string, i: number) => {
                        if (line.startsWith('## ')) {
                          const headingId = line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                          return <h2 key={i} id={headingId} className="font-display text-cream-contrast text-xl md:text-2xl font-semibold mt-10 mb-4 scroll-mt-24">{line.slice(3)}</h2>;
                        }
                        if (line.startsWith('---')) {
                          return <hr key={i} className="border-outline-variant my-8" />;
                        }
                        if (line.trim() === '') return <br key={i} />;
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <p key={i} className="my-2">
                            {parts.map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="text-cream-contrast font-semibold">{part.slice(2, -2)}</strong>;
                              }
                              const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g);
                              return linkParts.map((lp, k) => {
                                const linkMatch = lp.match(/\[([^\]]+)\]\(([^)]+)\)/);
                                if (linkMatch) {
                                  return <Link key={k} href={linkMatch[2]} className="text-primary hover:text-primary-container underline">{linkMatch[1]}</Link>;
                                }
                                return <span key={k}>{lp}</span>;
                              });
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags + Share */}
                  <div className="p-6 md:p-8 border-t border-outline-variant/30">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-on-surface-variant" />
                      {post.tags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">#{tag}</span>
                      ))}
                    </div>

                    {/* Social Share */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant font-medium">Share:</span>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <FaFacebookF className="w-4 h-4" />
                      </a>
                      <a href={`https://twitter.com/intent/tweet?text=${post.title}&url=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-sky-400 hover:bg-sky-500/10 transition-colors">
                        <FaTwitter className="w-4 h-4" />
                      </a>
                      <a href={getWhatsAppLink(`Namaste 11:11 Decoration Nepal!\n\nI would like to enquire about planning an event.\n\nI was reading: ${post.title}\n${typeof window !== 'undefined' ? window.location.href : ''}\n\nPlease share more details.`)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-green-400 hover:bg-green-500/10 transition-colors">
                        <FaWhatsapp className="w-4 h-4" />
                      </a>
                      <button onClick={copyLink} className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      {copiedLink && <span className="text-xs text-green-400">✓ Copied!</span>}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </article>

            {/* Right Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <div className="bg-surface-container border border-outline-variant rounded-2xl p-5">
                    <h3 className="font-display font-bold text-cream-contrast mb-4 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-primary text-xs">📑</span>
                      Table of Contents
                    </h3>
                    <nav className="space-y-1">
                      {headings.map((h: { id: string; text: string }) => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          className={`block text-xs py-1.5 px-3 rounded-lg transition-all ${activeToc === h.id ? 'text-primary bg-primary/10 font-medium' : 'text-on-surface-variant hover:text-cream-contrast hover:bg-surface-container-high'}`}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Featured Destinations */}
                <FeaturedDestinationsSidebar />
              </div>
            </aside>
          </div>
        </div>

        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-fixed transition-all z-50 animate-bounce"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </main>
    </CustomerLayout>
  );
}
