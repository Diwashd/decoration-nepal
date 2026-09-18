'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, Clock, FileText, Search, ToggleLeft, ToggleRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  publishedAt: string | null;
  viewCount: number;
  seoTitle: string;
  seoDescription: string;
}

const mockPosts: BlogPost[] = [
  { id: '1', title: 'Top 10 Wedding Decoration Trends in Nepal for 2026', slug: 'wedding-decoration-trends-nepal-2026', status: 'published', category: 'Wedding', publishedAt: '2026-08-15', viewCount: 1240, seoTitle: 'Wedding Decoration Trends 2026', seoDescription: 'Latest trends' },
  { id: '2', title: 'How to Plan the Perfect Birthday Party in Kathmandu', slug: 'plan-perfect-birthday-party-kathmandu', status: 'published', category: 'Birthday', publishedAt: '2026-08-10', viewCount: 890, seoTitle: 'Birthday Party Planning', seoDescription: 'Guide' },
  { id: '3', title: 'Traditional Pasni Ceremony: Decoration Ideas & Guide', slug: 'pasni-ceremony-decoration-ideas', status: 'published', category: 'Pasni', publishedAt: '2026-08-05', viewCount: 650, seoTitle: 'Pasni Decoration', seoDescription: 'Ideas' },
  { id: '4', title: 'Choosing the Right Venue: Party Palaces vs Hotels', slug: 'choosing-venue-party-palaces-vs-hotels', status: 'published', category: 'Tips', publishedAt: '2026-07-28', viewCount: 430, seoTitle: 'Venue Guide', seoDescription: 'Tips' },
  { id: '5', title: 'Anniversary Celebration Ideas: Make It Special', slug: 'anniversary-celebration-ideas', status: 'draft', category: 'Anniversary', publishedAt: null, viewCount: 0, seoTitle: '', seoDescription: '' },
  { id: '6', title: 'Corporate Event Decoration Guide 2026', slug: 'corporate-event-decoration-guide', status: 'draft', category: 'Corporate', publishedAt: null, viewCount: 0, seoTitle: '', seoDescription: '' },
];

const statusStyles: Record<string, string> = {
  published: 'bg-green-500/10 text-green-400 border-green-500/30',
  draft: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  archived: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts
    .filter((p) => filter === 'all' || p.status === filter)
    .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleStatus = (id: string) => {
    setPosts(posts.map((p) => {
      if (p.id !== id) return p;
      const newStatus = p.status === 'published' ? 'draft' : 'published';
      return { ...p, status: newStatus, publishedAt: newStatus === 'published' ? new Date().toISOString().split('T')[0] : null };
    }));
  };

  const deletePost = (id: string) => {
    if (!confirm('Delete this post?')) return;
    setPosts(posts.filter((p) => p.id !== id));
  };

  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Blog Posts
          </h1>
          <p className="text-on-surface-variant mt-1">Manage blog content. Posts auto-appear in sitemap when published.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed transition font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Total Posts</p>
          <p className="text-2xl font-bold text-cream-contrast font-display mt-1">{posts.length}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Published</p>
          <p className="text-2xl font-bold text-green-400 font-display mt-1">{publishedCount}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Drafts</p>
          <p className="text-2xl font-bold text-yellow-400 font-display mt-1">{draftCount}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Total Views</p>
          <p className="text-2xl font-bold text-primary font-display mt-1">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-high text-cream-contrast py-2.5 pl-10 pr-4 rounded border border-outline focus:border-primary focus:outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'published', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase transition-colors ${
                filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant border border-outline-variant'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Title</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Category</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Date</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Views</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-cream-contrast truncate max-w-md">{post.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">/{post.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary border border-primary/30">
                    {post.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${statusStyles[post.status]}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-on-surface-variant">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {post.viewCount.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(post.id)} className="p-1.5 hover:bg-surface-container-high rounded transition">
                      {post.status === 'published' ? <ToggleRight className="w-5 h-5 text-green-400" /> : <ToggleLeft className="w-5 h-5 text-on-surface-variant" />}
                    </button>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 hover:bg-surface-container-high rounded transition">
                      <Eye className="w-4 h-4 text-on-surface-variant" />
                    </Link>
                    <Link href={`/admin/blog/${post.slug}/edit`} className="p-1.5 hover:bg-surface-container-high rounded transition">
                      <Edit3 className="w-4 h-4 text-on-surface-variant" />
                    </Link>
                    <button onClick={() => deletePost(post.id)} className="p-1.5 hover:bg-red-500/10 rounded transition">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
