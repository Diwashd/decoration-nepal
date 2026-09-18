'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import SeoScoreBar from '@/components/admin/SeoScoreBar';
import DragDropImage from '@/components/ui/DragDropImage';

interface EventType { id: string; name: string }
interface NewPackageFormProps { eventTypes: EventType[] }

export default function NewPackageForm({ eventTypes }: NewPackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', eventTypeId: '', description: '', basePrice: '', sortOrder: '0', isActive: true, seoTitle: '', seoDescription: '', seoKeywords: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!formData.name || !formData.eventTypeId || !formData.basePrice) { setError('Please fill in all required fields'); return; }
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, basePrice: parseFloat(formData.basePrice) }) });
        const result = await response.json();
        if (result.success) { router.push('/admin/packages'); router.refresh(); } else setError(result.error || 'Failed to create package');
      } catch (err) { setError('Something went wrong.'); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/packages" className="p-2 hover:bg-surface-container-high rounded transition"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">Create New Package</h1>
            <p className="text-on-surface-variant mt-1">Add a new decoration package for customers</p>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold">
          <Save className="w-5 h-5" /><span>{isPending ? 'Saving...' : 'Save Package'}</span>
        </button>
      </div>

      {error && <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">{error}</div>}

      <div className="bg-surface-container border border-outline-variant rounded p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2"><label className="block text-sm font-semibold text-on-surface-variant mb-2">Package Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="e.g., Royal Wedding Package" required /></div>
          <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Event Type *</label><select value={formData.eventTypeId} onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required><option value="">Select event type</option>{eventTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div>
          <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Base Price (Rs.) *</label><input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="25000" min="0" step="100" required /></div>
          <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Display Order</label><input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" min="0" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-semibold text-on-surface-variant mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={4} placeholder="Describe what's included in this package..." /></div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Cover Image</label>
            <DragDropImage
              uploadFolder="packages"
              value={(formData as any).coverImage || ''}
              onChange={(url) => setFormData({ ...formData, coverImage: url } as any)}
              placeholder="Drag & drop package cover image"
              aspectRatio="video"
              maxSizeMB={5}
            />
          </div>
          <div className="md:col-span-2"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-primary border-outline-variant rounded" /><span className="text-sm font-medium text-on-surface-variant">Active (visible to customers)</span></label></div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-surface-container border border-outline-variant rounded p-6 space-y-4">
        <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
          <span className="text-primary">🔍</span> SEO Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">SEO Title</label>
            <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="e.g., Royal Wedding Package | 11:11 Decoration Nepal" />
            <p className="text-xs text-on-surface-variant mt-1">Recommended: 50-60 characters. Leave blank to use package name.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">SEO Description</label>
            <textarea value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={2} placeholder="Brief description for search engines..." />
            <p className="text-xs text-on-surface-variant mt-1">Recommended: 150-160 characters.</p>
          </div>              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Keywords</label>
                <input type="text" value={formData.seoKeywords} onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="wedding decoration, wedding package, mandap decoration" />
                <p className="text-xs text-on-surface-variant mt-1">Comma-separated keywords.</p>
              </div>

              {/* Live SEO Score */}
              <SeoScoreBar
                title={formData.seoTitle || formData.name}
                description={formData.seoDescription || formData.description}
                keywords={formData.seoKeywords}
              />
            </div>
          </div>

      <div className="bg-surface-container-high border border-outline-variant rounded p-4">
        <p className="text-sm text-on-surface-variant"><strong className="text-primary">Note:</strong> After creating the package, you'll be able to add specific services, components, and upload images in the edit page.</p>
      </div>
    </form>
  );
}
