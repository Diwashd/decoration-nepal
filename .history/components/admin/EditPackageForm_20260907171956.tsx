'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import SeoScoreBar from '@/components/admin/SeoScoreBar';
import DragDropImage from '@/components/ui/DragDropImage';

interface Package {
  id: string;
  name: string;
  eventTypeId: string;
  description: string | null;
  basePrice: number;
  isActive: boolean;
  images: any;
  createdAt: Date;
  updatedAt: Date;
  eventType: { id: string; name: string };
}

interface EventType { id: string; name: string }

interface EditPackageFormProps { package: Package; eventTypes: EventType[] }

export default function EditPackageForm({ package: pkg, eventTypes }: EditPackageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: pkg.name, eventTypeId: pkg.eventTypeId, description: pkg.description || '', basePrice: pkg.basePrice.toString(), sortOrder: String((pkg as Package & { sortOrder?: number }).sortOrder || 0), isActive: pkg.isActive, seoTitle: '', seoDescription: '', seoKeywords: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setSuccess(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...formData, basePrice: parseFloat(formData.basePrice) }) });
        const result = await response.json();
        if (result.success) { setSuccess('Package updated successfully!'); setTimeout(() => { router.push('/admin/packages'); router.refresh(); }, 1500); }
        else setError(result.error || 'Failed to update package');
      } catch (err) { setError('Something went wrong. Please try again.'); }
    });
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) { router.push('/admin/packages'); router.refresh(); } else setError(result.error || 'Failed to delete package');
      } catch (err) { setError('Something went wrong.'); }
    });
  };

  const toggleActive = async () => {
    const newStatus = !formData.isActive;
    setFormData({ ...formData, isActive: newStatus });
    try {
      await fetch(`/api/admin/packages/${pkg.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: newStatus }) });
      setSuccess(`Package ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) { setError('Failed to update status'); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/packages" className="p-2 hover:bg-surface-container-high rounded transition"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">Edit Package</h1>
            <p className="text-on-surface-variant mt-1">Update package details</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button type="button" onClick={toggleActive} className={`flex items-center space-x-2 px-4 py-2.5 rounded border transition font-semibold ${formData.isActive ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20' : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:bg-surface-container'}`}>
            {formData.isActive ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
          </button>
          <button type="button" onClick={handleDelete} className="flex items-center space-x-2 bg-surface-container-high text-on-surface px-4 py-2.5 rounded border border-outline-variant hover:border-primary transition font-semibold">
            <Trash2 className="w-5 h-5" /><span>Delete</span>
          </button>
          <button type="submit" disabled={isPending} className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold">
            <Save className="w-5 h-5" /><span>{isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {error && <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded p-6 space-y-6">
            <h2 className="text-lg font-bold text-cream-contrast">Package Details</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Package Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required /></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Event Type *</label><select value={formData.eventTypeId} onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required>{eventTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Base Price (Rs.) *</label><input type="number" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" min="0" step="100" required /></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Display Order</label><input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" min="0" /></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={4} placeholder="Describe what's included..." /></div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-surface-container border border-outline-variant rounded p-6 space-y-4">
            <h2 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
              <span className="text-primary">🔍</span> SEO Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">SEO Title</label>
                <input type="text" value={formData.seoTitle} onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="e.g., Royal Wedding Package | 11:11 Decoration Nepal" />
                <p className="text-xs text-on-surface-variant mt-1">Leave blank to use package name.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">SEO Description</label>
                <textarea value={formData.seoDescription} onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={2} placeholder="Brief description for search engines..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Keywords</label>
                <input type="text" value={formData.seoKeywords} onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="wedding decoration, wedding package, mandap decoration" />
              </div>

              {/* Live SEO Score */}
              <SeoScoreBar
                title={formData.seoTitle || formData.name}
                description={formData.seoDescription || formData.description}
                keywords={formData.seoKeywords}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Package Info</h3>
            <div className="space-y-3 text-sm">
              <div><span className="text-on-surface-variant">ID:</span><span className="block font-mono text-xs text-on-surface mt-1">{pkg.id}</span></div>
              <div><span className="text-on-surface-variant">Current Price:</span><span className="block font-bold text-primary text-lg mt-1">{formatCurrency(pkg.basePrice)}</span></div>
              <div><span className="text-on-surface-variant">Status:</span><span className={`block font-semibold mt-1 ${pkg.isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{pkg.isActive ? 'Active (Visible to customers)' : 'Inactive (Hidden)'}</span></div>
              <div><span className="text-on-surface-variant">Created:</span><span className="block text-on-surface mt-1">{new Date(pkg.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            </div>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Package Image</h3>
            <DragDropImage
              uploadFolder="packages"
              value={pkg.images?.[0]?.url || ''}
              onChange={(url) => console.log('Image updated:', url)}
              placeholder="Drag & drop package image"
              aspectRatio="video"
              maxSizeMB={5}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
