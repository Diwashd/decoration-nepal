'use client';

import { useParams, useRouter } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getBlogPostBySlug, getBlogPosts, saveBlogPosts } from '@/lib/store/admin-store';

const fallbackPosts: Record<string, any> = {
  'wedding-decoration-trends-nepal-2026': {
    id: '1', title: 'Top Wedding Decoration Trends in Nepal for 2026', slug: 'wedding-decoration-trends-nepal-2026',
    content: '# Top Wedding Decoration Trends in Nepal for 2026\n\n## 1. Sustainable & Eco-Friendly Decor\nBrides are choosing sustainable decoration options.\n\n## 2. Pastel Color Palettes\nSoft pastels are replacing bright red and gold.\n\n## 3. Minimalist Stage Design\nClean lines and strategic lighting.\n\n## 4. Drone Photography Integration\nWedding venues designed with drone-friendly spaces.\n\n## 5. Personalized Neon Signs\nCustom neon signs with couple names.',
    excerpt: 'Discover the latest wedding decoration trends in Nepal for 2026.', category: 'Wedding',
    tags: ['wedding', 'decoration', 'trends', '2026'], status: 'published',
    seoTitle: 'Top Wedding Decoration Trends Nepal 2026', seoDescription: 'Explore latest wedding decoration trends in Nepal.', seoKeywords: 'wedding decoration nepal',
    coverImage: '',
  },
};

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fromStore = getBlogPostBySlug(slug);
    setPost(fromStore || fallbackPosts[slug] || {
      id: String(Date.now()), title: '', slug, content: '', excerpt: '',
      category: 'Tips', tags: [], status: 'draft',
      seoTitle: '', seoDescription: '', seoKeywords: '', coverImage: '',
    });
  }, [slug]);

  const handleSave = (data: any) => {
    const existing = getBlogPosts();
    const idx = existing.findIndex(p => p.slug === data.slug);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...data };
    } else {
      existing.push({ id: String(Date.now()), ...data, author: 'Eleven Eleven Team', readTime: '3 min read', likes: 0, comments: 0 });
    }
    saveBlogPosts(existing);
    alert('Blog post updated successfully!');
  };

  if (!post) return <div className="p-8 text-on-surface-variant">Loading...</div>;

  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="flex items-center gap-2 text-on-surface-variant hover:text-cream-contrast transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>
      <BlogEditor initialData={post} onSave={handleSave} />
    </div>
  );
}
