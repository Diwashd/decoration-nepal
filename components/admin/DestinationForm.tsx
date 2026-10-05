'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DragDropImage from '@/components/ui/DragDropImage';

type Destination = {
  id: string;
  name: string;
  location: string;
  type: string;
  capacity: string;
  priceRange: string;
  description: string;
  contact?: string | null;
  amenities: string[];
  featured: boolean;
  image?: string | null;
  order?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
};

export default function DestinationForm({ destination }: { destination?: Destination }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: destination?.name || '', location: destination?.location || '', type: destination?.type || 'hotel',
    capacity: destination?.capacity || '', priceRange: destination?.priceRange || '', description: destination?.description || '',
    contact: destination?.contact || '', amenities: destination?.amenities.join(', ') || '', featured: destination?.featured || false,
    image: destination?.image || '', order: destination?.order || 0,
    seoTitle: destination?.seoTitle || '', seoDescription: destination?.seoDescription || '', seoKeywords: destination?.seoKeywords || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const response = await fetch('/api/admin/destinations', {
      method: destination ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(destination ? { id: destination.id } : {}), ...form, amenities: form.amenities.split(',').map(item => item.trim()).filter(Boolean) }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to save destination');
      return;
    }
    router.push('/admin/destinations');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link href="/admin/destinations" className="text-sm text-primary hover:text-primary-container">← Back to Destinations</Link>
        <h1 className="text-3xl font-bold font-display text-cream-contrast mt-3">{destination ? 'Edit Destination' : 'New Destination'}</h1>
        <p className="text-on-surface-variant mt-1">Manage venue information and its frontend presentation.</p>
      </div>
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        <label className="block text-xs text-on-surface-variant">Venue Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="e.g. Hotel & Restaurant Shree Lekha" /></label>
        <label className="block text-xs text-on-surface-variant">Venue Image<DragDropImage value={form.image} uploadFolder="destinations" onChange={image => setForm({ ...form, image })} placeholder="Drag & drop venue photo" aspectRatio="video" maxSizeMB={5} /></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-xs text-on-surface-variant">Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></label>
          <label className="text-xs text-on-surface-variant">Type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface"><option value="hotel">Hotel</option><option value="banquet">Banquet Hall</option><option value="party_palace">Party Palace</option><option value="restaurant">Restaurant</option></select></label>
          <label className="text-xs text-on-surface-variant">Capacity<input value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="50-500 guests" /></label>
          <label className="text-xs text-on-surface-variant">Price range<input value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Rs. 1,50,000 - Rs. 8,00,000" /></label>
          <label className="text-xs text-on-surface-variant">Contact<input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></label>
          <label className="text-xs text-on-surface-variant">Display order<input type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) || 0 })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></label>
        </div>
        <label className="block text-xs text-on-surface-variant">Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" /></label>
        <label className="block text-xs text-on-surface-variant">Amenities<span className="block text-[11px] mt-1 text-on-surface-variant/70">Separate amenities with commas</span><input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></label>
        <div className="border-t border-outline-variant pt-5 space-y-4">
          <h2 className="text-lg font-semibold text-cream-contrast">SEO Settings</h2>
          <label className="block text-xs text-on-surface-variant">SEO title<input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder={`${form.name || 'Venue'} | 11:11 Decoration Nepal`} /></label>
          <label className="block text-xs text-on-surface-variant">SEO description<textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" /></label>
          <label className="block text-xs text-on-surface-variant">SEO keywords<input value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="venue name, event venue, wedding venue Nepal" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-on-surface"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured venue</label>
        <div className="flex justify-end gap-3 border-t border-outline-variant pt-5">
          <Link href="/admin/destinations" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high">Cancel</Link>
          <button onClick={save} disabled={!form.name || saving} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save Destination'}</button>
        </div>
      </div>
    </div>
  );
}
