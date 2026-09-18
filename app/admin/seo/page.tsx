'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, Globe, FileText, Bot, Image, Plus, Trash2, Search, Map } from 'lucide-react';
import SeoScoreBar from '@/components/admin/SeoScoreBar';

interface SeoPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  noindex: boolean;
}

const defaultPages: SeoPage[] = [
  {
    id: '1',
    slug: '/',
    title: '11:11 Decoration Nepal | Luxury Event Planning & Decoration Services',
    description: 'Premium event decoration and planning services in Nepal. Wedding, Pasni, Birthday, Anniversary decorations crafted with excellence.',
    keywords: 'decoration in nepal, event planning nepal, wedding decoration nepal, 11:11 decoration',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com',
    noindex: false,
  },
  {
    id: '2',
    slug: '/about',
    title: 'About Us | 11:11 Decoration Nepal',
    description: 'Welcome to Eleven Eleven — a premier decorations and event management company in Nepal. Sister company to Naulo Koseli (NK).',
    keywords: 'about eleven eleven nepal, event management company nepal, naulo koseli',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/about',
    noindex: false,
  },
  {
    id: '3',
    slug: '/services',
    title: 'Our Services | 11:11 Decoration Nepal',
    description: 'Complete event solutions — decoration, venue finding, photography, makeup, catering, band baja, DJ lights, and more.',
    keywords: 'decoration services nepal, wedding decoration, venue finding nepal, catering nepal',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/services',
    noindex: false,
  },
  {
    id: '4',
    slug: '/contact',
    title: 'Contact Us | 11:11 Decoration Nepal',
    description: 'Book your extraordinary event today. Contact us at +977-9847411305. Jawalakhel, Lalitpur, Nepal.',
    keywords: 'contact decoration nepal, book event nepal, event inquiry kathmandu',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/contact',
    noindex: false,
  },
  {
    id: '5',
    slug: '/planner',
    title: 'Event Planner | 11:11 Decoration Nepal',
    description: 'Plan your dream event with our interactive wizard. Choose event type, destination, theme — get a quote within 24 hours.',
    keywords: 'event planner nepal, wedding planner kathmandu, event quotation nepal',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/planner',
    noindex: false,
  },
  {
    id: '6',
    slug: '/wedding-decoration',
    title: 'Wedding Decoration in Nepal | 11:11 Decoration Nepal',
    description: 'Complete wedding decoration services — mandap, stage, entrance gate, reception setup. Luxury wedding decoration by Eleven Eleven.',
    keywords: 'wedding decoration nepal, wedding mandap kathmandu, marriage decoration',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/wedding-decoration',
    noindex: false,
  },
  {
    id: '7',
    slug: '/birthday-decoration',
    title: 'Birthday Decoration in Nepal | 11:11 Decoration Nepal',
    description: 'Creative birthday party decorations in Nepal. Balloon arrangements, themed setups, surprise planning for all ages.',
    keywords: 'birthday decoration nepal, birthday party kathmandu, surprise birthday nepal',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/birthday-decoration',
    noindex: false,
  },
  {
    id: '8',
    slug: '/pasni-decoration',
    title: 'Pasni Decoration in Nepal | 11:11 Decoration Nepal',
    description: 'Traditional Pasni ceremony decoration in Nepal. Cultural richness with modern aesthetics.',
    keywords: 'pasni decoration nepal, rice feeding ceremony, pasni ceremony kathmandu',
    ogImage: '/og-image.jpg',
    canonical: 'https://decorationnepal.com/pasni-decoration',
    noindex: false,
  },
];

export default function SeoSettingsPage() {
  const [pages, setPages] = useState<SeoPage[]>(defaultPages);
  const [selectedPage, setSelectedPage] = useState<SeoPage>(defaultPages[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPages = pages.filter(
    (p) =>
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updatePage = (field: keyof SeoPage, value: string | boolean) => {
    const updated = { ...selectedPage, [field]: value };
    setSelectedPage(updated);
    setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
  };

  const addNewPage = () => {
    const newPage: SeoPage = {
      id: `new-${Date.now()}`,
      slug: '/new-page',
      title: 'New Page | 11:11 Decoration Nepal',
      description: 'Page description here',
      keywords: '',
      ogImage: '/og-image.jpg',
      canonical: '',
      noindex: false,
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
  };

  const deletePage = (id: string) => {
    if (pages.length <= 1) return;
    const filtered = pages.filter((p) => p.id !== id);
    setPages(filtered);
    if (selectedPage.id === id) {
      setSelectedPage(filtered[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const truncate = (str: string, len: number) =>
    str.length > len ? str.slice(0, len) + '...' : str;

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
              <Search className="w-8 h-8 text-primary" />
              SEO Settings
            </h1>
            <p className="text-on-surface-variant mt-1">Manage meta tags, descriptions, and Open Graph data for all pages.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/seo/llms-txt"
              className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
            >
              <Bot className="w-4 h-4" />
              <span>llms.txt</span>
            </Link>
            <Link
              href="/admin/seo/sitemap"
              className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
            >
              <Map className="w-4 h-4" />
              <span>Sitemap</span>
            </Link>
            <Link
              href="/admin/seo/audit"
              className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
            >
              <Search className="w-4 h-4" />
              <span>Audit</span>
            </Link>
            <button
              onClick={addNewPage}
              className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Page</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed disabled:opacity-50 transition font-semibold text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : saved ? '✓ Saved' : 'Save All'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Page List */}
          <div className="col-span-4 bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-4 border-b border-outline-variant">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-high text-cream-contrast py-2 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
              />
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {filteredPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full text-left p-4 border-b border-outline-variant/50 transition-colors ${
                    selectedPage.id === page.id
                      ? 'bg-primary/10 border-l-2 border-l-primary'
                      : 'hover:bg-surface-container-high border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-cream-contrast truncate">{page.slug}</p>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">{truncate(page.title, 40)}</p>
                    </div>
                    {page.noindex && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded ml-2">NoIndex</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-8 space-y-6">
            {/* Slug */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" /> Page Path
              </label>
              <input
                type="text"
                value={selectedPage.slug}
                onChange={(e) => updatePage('slug', e.target.value)}
                className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm font-mono"
              />
            </div>

            {/* Title & Description */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
              <h3 className="text-lg font-bold text-cream-contrast mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Meta Tags
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                    Page Title <span className="text-on-surface-variant/50 normal-case">({selectedPage.title.length}/60)</span>
                  </label>
                  <input
                    type="text"
                    value={selectedPage.title}
                    onChange={(e) => updatePage('title', e.target.value)}
                    className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Recommended: 50-60 characters. Include primary keyword.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                    Meta Description <span className="text-on-surface-variant/50 normal-case">({selectedPage.description.length}/160)</span>
                  </label>
                  <textarea
                    value={selectedPage.description}
                    onChange={(e) => updatePage('description', e.target.value)}
                    className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Recommended: 150-160 characters. Include a call to action.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Keywords</label>
                  <input
                    type="text"
                    value={selectedPage.keywords}
                    onChange={(e) => updatePage('keywords', e.target.value)}
                    className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Comma-separated. Focus on 5-10 relevant keywords.</p>
                </div>
              </div>
            </div>

            {/* Open Graph */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
              <h3 className="text-lg font-bold text-cream-contrast mb-4 flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" /> Open Graph / Social
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">OG Image Path</label>
                  <input
                    type="text"
                    value={selectedPage.ogImage}
                    onChange={(e) => updatePage('ogImage', e.target.value)}
                    className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm"
                    placeholder="/images/og-home.jpg"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Recommended: 1200x630px. Used for social media previews.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Canonical URL</label>
                  <input
                    type="text"
                    value={selectedPage.canonical}
                    onChange={(e) => updatePage('canonical', e.target.value)}
                    className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm font-mono"
                    placeholder="https://decorationnepal.com/page-slug"
                  />
                </div>

                {/* OG Image Preview */}
                <div className="mt-4">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Social Preview</label>
                  <div className="bg-white rounded-xl overflow-hidden border border-outline-variant max-w-md">
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      {selectedPage.ogImage ? (
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${selectedPage.ogImage}')` }} />
                      ) : (
                        <span className="text-gray-400 text-sm">No image set</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-blue-700 text-sm font-medium truncate">{selectedPage.title || 'Page Title'}</p>
                      <p className="text-green-700 text-xs mt-0.5">{selectedPage.canonical || `decorationnepal.com${selectedPage.slug}`}</p>
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{selectedPage.description || 'Page description...'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live SEO Score */}
            <SeoScoreBar
              title={selectedPage.title}
              description={selectedPage.description}
              keywords={selectedPage.keywords}
              slug={selectedPage.slug}
            />

            {/* Robots */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
              <h3 className="text-lg font-bold text-cream-contrast mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" /> Indexing
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPage.noindex}
                  onChange={(e) => updatePage('noindex', e.target.checked)}
                  className="w-5 h-5 rounded border-outline accent-primary"
                />
                <div>
                  <p className="text-sm font-semibold text-cream-contrast">NoIndex (Hide from search engines)</p>
                  <p className="text-xs text-on-surface-variant">When enabled, this page will not appear in Google search results.</p>
                </div>
              </label>
            </div>

            {/* Preview */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
              <h3 className="text-lg font-bold text-cream-contrast mb-4">Google Preview</h3>
              <div className="bg-white rounded-lg p-5 max-w-xl">
                <p className="text-blue-700 text-lg font-normal hover:underline cursor-pointer truncate">
                  {selectedPage.title}
                </p>
                <p className="text-green-700 text-sm mt-1">{selectedPage.canonical || `https://decorationnepal.com${selectedPage.slug}`}</p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{selectedPage.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
