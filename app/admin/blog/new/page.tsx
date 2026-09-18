'use client';

import BlogEditor from '@/components/admin/BlogEditor';
import { useBlogSitemapUpdate } from '@/lib/hooks/useSitemapAutoUpdate';
import { getBlogPosts, saveBlogPosts } from '@/lib/store/admin-store';

export default function NewBlogPostPage() {
  const { onPublish } = useBlogSitemapUpdate();

  const handleSave = async (data: any) => {
    // Save to admin store (localStorage)
    const existing = getBlogPosts();
    const newPost = {
      id: String(Date.now()),
      title: data.title || '',
      slug: data.slug || '',
      content: data.content || '',
      excerpt: data.excerpt || '',
      category: data.category || 'Tips',
      tags: data.tags || [],
      status: data.status || 'draft',
      coverImage: data.coverImage || '',
      author: 'Eleven Eleven Team',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 min read',
      likes: 0,
      comments: 0,
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
      seoKeywords: data.seoKeywords || '',
    };

    // Check if slug already exists (update) or add new
    const idx = existing.findIndex(p => p.slug === newPost.slug);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], ...newPost };
    } else {
      existing.push(newPost);
    }
    saveBlogPosts(existing);

    // Update sitemap if published
    if (data.status === 'published') {
      await onPublish(data.slug, data.title);
    }

    alert('Blog post saved successfully!');
  };

  return <BlogEditor onSave={handleSave} />;
}
