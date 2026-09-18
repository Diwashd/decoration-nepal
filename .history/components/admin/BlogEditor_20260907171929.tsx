'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Image, Quote, Code, Minus, Eye, Edit3, Save, ArrowLeft, LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import SeoScoreBar from '@/components/admin/SeoScoreBar';
import DragDropImage from '@/components/ui/DragDropImage';

interface BlogEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    status: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  };
  onSave?: (data: any) => void;
}

const categories = ['Wedding', 'Birthday', 'Pasni', 'Anniversary', 'Haldi & Mehendi', 'Tips', 'Corporate', 'General'];

export default function BlogEditor({ initialData, onSave }: BlogEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    coverImage: initialData?.coverImage || '',
    category: initialData?.category || 'General',
    tags: initialData?.tags || [] as string[],
    status: initialData?.status || 'draft',
    seoTitle: initialData?.seoTitle || '',
    seoDescription: initialData?.seoDescription || '',
    seoKeywords: initialData?.seoKeywords || '',
  });

  const [tagInput, setTagInput] = useState('');

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    }));
  };

  // Insert markdown at cursor
  const insertMarkdown = useCallback((prefix: string, suffix: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end) || placeholder;
    const newContent = formData.content.substring(0, start) + prefix + selected + suffix + formData.content.substring(end);

    setFormData((prev) => ({ ...prev, content: newContent }));

    // Restore cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selected.length;
    }, 0);
  }, [formData.content]);

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), title: 'Italic' },
    { icon: Heading1, action: () => insertMarkdown('\n## ', '\n', 'Heading'), title: 'Heading 2' },
    { icon: Heading2, action: () => insertMarkdown('\n### ', '\n', 'Subheading'), title: 'Heading 3' },
    { icon: List, action: () => insertMarkdown('\n- ', '\n', 'List item'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. ', '\n', 'List item'), title: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('\n> ', '\n', 'Quote text'), title: 'Quote' },
    { icon: LinkIcon, action: () => insertMarkdown('[', '](url)', 'link text'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')', 'image-url'), title: 'Image' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), title: 'Code' },
    { icon: Minus, action: () => insertMarkdown('\n---\n'), title: 'Divider' },
  ];

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSave = async (status?: string) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave?.({ ...formData, status: status || formData.status });
  };

  const renderPreview = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-cream-contrast mt-6 mb-3 font-display">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-cream-contrast mt-4 mb-2 font-display">{line.slice(4)}</h3>;
      if (line.startsWith('> ')) return <p key={i} className="border-l-2 border-primary/30 pl-4 italic text-on-surface-variant my-2">{line.slice(2)}</p>;
      if (line.startsWith('- ')) return <p key={i} className="ml-4 my-1 text-on-surface-variant">• {line.slice(2)}</p>;
      if (line.startsWith('---')) return <hr key={i} className="border-outline-variant my-6" />;
      if (line.trim() === '') return <br key={i} />;
      // Bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="text-on-surface-variant my-1.5 leading-relaxed">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-cream-contrast font-semibold">{part.slice(2, -2)}</strong>;
            }
            const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g);
            return linkParts.map((lp, k) => {
              const linkMatch = lp.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (linkMatch) return <Link key={k} href={linkMatch[2]} className="text-primary underline">{linkMatch[1]}</Link>;
              return <span key={k}>{lp}</span>;
            });
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blog" className="p-2 hover:bg-surface-container-high rounded transition">
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">
              {initialData?.id ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-on-surface-variant mt-1">Write and publish blog content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high disabled:opacity-50 transition font-semibold text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed disabled:opacity-50 transition font-semibold text-sm"
          >
            {saving ? 'Saving...' : saved ? '✓ Published' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Editor */}
        <div className="col-span-8 space-y-6">
          {/* Title */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-transparent text-cream-contrast text-3xl font-display font-bold focus:outline-none placeholder:text-on-surface-variant/30"
              placeholder="Enter post title..."
            />
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-on-surface-variant">Slug:</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 bg-transparent text-sm text-on-surface-variant font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-surface-container-high text-cream-contrast py-3 px-4 border-b border-outline focus:border-primary focus:outline-none transition-colors text-sm resize-none"
              rows={2}
              placeholder="Brief summary for listings and SEO..."
            />
          </div>

          {/* Content Editor */}
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2 bg-surface-container-high border-b border-outline-variant">
              {toolbarButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  className="p-2 rounded hover:bg-surface-container transition text-on-surface-variant hover:text-cream-contrast"
                >
                  {React.createElement(btn.icon as any, { className: 'w-4 h-4' })}
                </button>
              ))}
              <div className="flex-1" />
              <div className="flex bg-surface-container rounded-lg overflow-hidden border border-outline-variant">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition ${activeTab === 'edit' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold transition ${activeTab === 'preview' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
            </div>

            {/* Editor / Preview */}
            {activeTab === 'edit' ? (
              <textarea
                ref={textareaRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-surface text-cream-contrast p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none min-h-[500px]"
                placeholder="Write your blog post content in markdown..."
              />
            ) : (
              <div className="p-6 min-h-[500px]">
                {formData.content ? renderPreview(formData.content) : (
                  <p className="text-on-surface-variant italic">Nothing to preview yet...</p>
                )}
              </div>
            )}

            {/* Word Count */}
            <div className="px-4 py-2 bg-surface-container-high border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
              <span>{formData.content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{formData.content.length} characters</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 space-y-6">
          {/* Cover Image */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Cover Image</label>
            <DragDropImage
              uploadFolder="blog"
              value={formData.coverImage}
              onChange={(url) => setFormData({ ...formData, coverImage: url })}
              placeholder="Drag & drop blog cover image"
              aspectRatio="wide"
              maxSizeMB={5}
            />
          </div>

          {/* Category & Tags */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 bg-surface-container-high text-cream-contrast py-2 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
                  placeholder="Add tag..."
                />
                <button onClick={addTag} className="bg-primary text-on-primary px-3 py-2 rounded text-sm font-semibold hover:bg-primary-fixed transition">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs border border-outline-variant">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Score */}
          <SeoScoreBar
            title={formData.seoTitle || formData.title}
            description={formData.seoDescription || formData.excerpt}
            keywords={formData.seoKeywords}
            slug={formData.slug}
          />

          {/* SEO Section */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-cream-contrast flex items-center gap-2">
              <span className="text-primary">🔍</span> SEO
            </h3>
            <div>
              <label className="text-xs text-on-surface-variant mb-1 block">Title ({formData.seoTitle.length || formData.title.length}/60)</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
                placeholder={formData.title || 'SEO title...'}
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant mb-1 block">Description ({(formData.seoDescription || formData.excerpt).length}/160)</label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm resize-none"
                rows={2}
                placeholder={formData.excerpt || 'SEO description...'}
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant mb-1 block">Keywords</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
