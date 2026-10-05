'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DragDropImage from '@/components/ui/DragDropImage';

type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  active: boolean;
  icon: string;
  featured: boolean;
  order: number;
  image?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
};

type ServiceFormProps = {
  service?: Service;
};

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: service?.name || '',
    category: service?.category || 'core',
    description: service?.description || '',
    price: service?.price || '',
    icon: service?.icon || '✨',
    featured: service?.featured || false,
    image: service?.image || '',
    active: service?.active ?? true,
    order: service?.order || 0,
    seoTitle: service?.seoTitle || '',
    seoDescription: service?.seoDescription || '',
    seoKeywords: service?.seoKeywords || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveService = async () => {
    setIsSaving(true);
    setError(null);
    const basePrice = Number(form.price.replace(/[^0-9]/g, '')) || 0;
    const response = await fetch('/api/admin/services', {
      method: service ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(service ? { id: service.id } : {}),
        ...form,
        basePrice,
      }),
    });
    const result = await response.json();
    setIsSaving(false);
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to save service');
      return;
    }
    router.push('/admin/services');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/services" className="text-sm text-primary hover:text-primary-container">← Back to Services</Link>
        <h1 className="text-3xl font-bold font-display text-cream-contrast mt-3">{service ? 'Edit Service' : 'New Service'}</h1>
        <p className="text-on-surface-variant mt-1">Manage service details without leaving the page.</p>
      </div>
      <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4">
          <label className="text-xs text-on-surface-variant">Icon<input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-2xl text-center" /></label>
          <label className="text-xs text-on-surface-variant">Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Service name" /></label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-xs text-on-surface-variant">Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface"><option value="core">Core</option><option value="additional">Additional</option></select></label>
          <label className="text-xs text-on-surface-variant">Price<input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="From Rs. X" /></label>
        </div>
        <label className="block text-xs text-on-surface-variant">Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" /></label>
        <label className="block text-xs text-on-surface-variant">Service Image<DragDropImage value={form.image} uploadFolder="services" onChange={image => setForm({ ...form, image })} placeholder="Drag & drop service image" aspectRatio="video" maxSizeMB={5} /></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-on-surface"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured on homepage</label>
          <label className="text-xs text-on-surface-variant">Display order<input type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) || 0 })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" /></label>
        </div>
        <label className="flex items-center gap-2 text-sm text-on-surface"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active and visible in quotations</label>
        <div className="border-t border-outline-variant pt-5 space-y-4">
          <h2 className="text-lg font-semibold text-cream-contrast">SEO Settings</h2>
          <label className="block text-xs text-on-surface-variant">SEO title<input value={form.seoTitle} onChange={e => setForm({ ...form, seoTitle: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder={`${form.name || 'Service'} | 11:11 Decoration Nepal`} /></label>
          <label className="block text-xs text-on-surface-variant">SEO description<textarea value={form.seoDescription} onChange={e => setForm({ ...form, seoDescription: e.target.value })} rows={2} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" /></label>
          <label className="block text-xs text-on-surface-variant">SEO keywords<input value={form.seoKeywords} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} className="mt-1 w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="event decoration, wedding services Nepal" /></label>
        </div>
        <div className="flex justify-end gap-3 border-t border-outline-variant pt-5">
          <Link href="/admin/services" className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high">Cancel</Link>
          <button onClick={saveService} disabled={!form.name || isSaving} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Service'}</button>
        </div>
      </div>
    </div>
  );
}
