'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit3, Star, Eye, EyeOff, GripVertical, Save, Check, Search, Grid, List } from 'lucide-react';
import DragDropImage from '@/components/ui/DragDropImage';
import { getGalleryImages, saveGalleryImages, type AdminStoreGalleryImage } from '@/lib/store/admin-store';

const defaultImages: AdminStoreGalleryImage[] = [
  { id: '1', url: '', title: 'Royal Wedding Mandap', description: 'Floral arch mandap setup at Soaltee Hotel Crown Plaza', category: 'Wedding', tags: ['wedding', 'mandap', 'floral'], eventType: 'wedding', featured: true, order: 1, createdAt: '2026-08-15' },
  { id: '2', url: '', title: 'Birthday Balloon Backdrop', description: 'Colorful balloon arrangement for a 5th birthday party', category: 'Birthday', tags: ['birthday', 'balloons', 'kids'], eventType: 'birthday', featured: true, order: 2, createdAt: '2026-08-12' },
  { id: '3', url: '', title: 'Pasni Ceremony Stage', description: 'Traditional pasni stage with marigold and banana leaf decor', category: 'Pasni', tags: ['pasni', 'traditional', 'stage'], eventType: 'pasni', featured: true, order: 3, createdAt: '2026-08-10' },
  { id: '4', url: '', title: 'Anniversary Dinner Setup', description: 'Romantic candlelit dinner arrangement for anniversary celebration', category: 'Anniversary', tags: ['anniversary', 'romantic', 'dinner'], eventType: 'anniversary', featured: false, order: 4, createdAt: '2026-08-08' },
  { id: '5', url: '', title: 'Haldi Mehendi Decor', description: 'Yellow and green themed haldi mehendi ceremony decoration', category: 'Haldi & Mehendi', tags: ['haldi', 'mehendi', 'pre-wedding'], eventType: 'haldi', featured: false, order: 5, createdAt: '2026-08-05' },
  { id: '6', url: '', title: 'Corporate Event Stage', description: 'Professional corporate event backdrop with LED lighting', category: 'Corporate', tags: ['corporate', 'professional', 'stage'], eventType: 'corporate', featured: false, order: 6, createdAt: '2026-08-01' },
];

const categories = ['All', 'Wedding', 'Birthday', 'Pasni', 'Anniversary', 'Haldi & Mehendi', 'Corporate', 'Other'];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<AdminStoreGalleryImage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<AdminStoreGalleryImage | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Wedding', tags: '', eventType: 'wedding', featured: false, url: '',
  });

  useEffect(() => {
    setImages(getGalleryImages());
    setLoaded(true);
  }, []);

  const filtered = images.filter(
    (img) =>
      (filter === 'All' || img.category === filter) &&
      (img.title.toLowerCase().includes(search.toLowerCase()) || img.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (img: AdminStoreGalleryImage) => {
    setEditing(img);
    setForm({ title: img.title, description: img.description, category: img.category, tags: img.tags.join(', '), eventType: img.eventType, featured: img.featured, url: img.url });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: 'Wedding', tags: '', eventType: 'wedding', featured: false, url: '' });
    setShowModal(true);
  };

  const saveImage = () => {
    const imageData: AdminStoreGalleryImage = {
      id: editing?.id || String(Date.now()),
      url: form.url,
      title: form.title,
      description: form.description,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      eventType: form.eventType,
      featured: form.featured,
      order: editing?.order || images.length + 1,
      createdAt: editing?.createdAt || new Date().toISOString().split('T')[0],
    };

    let updated: AdminStoreGalleryImage[];
    if (editing) {
      updated = images.map(img => img.id === editing.id ? imageData : img);
    } else {
      updated = [...images, imageData];
    }

    setImages(updated);
    saveGalleryImages(updated);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deleteImage = (id: string) => {
    if (confirm('Delete this image from gallery?')) {
      const updated = images.filter(img => img.id !== id);
      setImages(updated);
      saveGalleryImages(updated);
    }
  };

  const toggleFeatured = (id: string) => {
    const updated = images.map(img => img.id === id ? { ...img, featured: !img.featured } : img);
    setImages(updated);
    saveGalleryImages(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...images];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    arr.forEach((img, i) => img.order = i + 1);
    setImages(arr);
    saveGalleryImages(arr);
  };

  const moveDown = (index: number) => {
    if (index >= images.length - 1) return;
    const arr = [...images];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    arr.forEach((img, i) => img.order = i + 1);
    setImages(arr);
    saveGalleryImages(arr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Link href="/admin" className="flex items-center gap-2 text-on-surface-variant hover:text-cream-contrast text-sm transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Gallery</h1>
          <p className="text-on-surface-variant mt-1">Manage your event photos and images</p>
        </div>
        <div className="flex gap-3">
          <Link href="/gallery" target="_blank" className="flex items-center gap-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-sm">
            <Eye className="w-4 h-4" /> View Frontend
          </Link>
          <button onClick={openNew} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-fixed transition-colors">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: images.length, color: 'text-cream-contrast' },
          { label: 'Featured', value: images.filter(i => i.featured).length, color: 'text-primary' },
          { label: 'Wedding', value: images.filter(i => i.category === 'Wedding').length, color: 'text-pink-400' },
          { label: 'Birthday', value: images.filter(i => i.category === 'Birthday').length, color: 'text-blue-400' },
          { label: 'Pasni', value: images.filter(i => i.category === 'Pasni').length, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container border border-outline-variant rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input type="text" placeholder="Search images..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-surface-container border border-outline-variant rounded-xl p-1">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}><Grid className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <div key={img.id} className="group bg-surface-container border border-outline-variant rounded-xl overflow-hidden hover:border-primary/30 transition-all">
              <div className="aspect-square bg-surface-container-high flex items-center justify-center relative overflow-hidden">
                {img.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-4xl block mb-2">🖼️</span>
                    <p className="text-xs text-on-surface-variant">No image uploaded</p>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(img)} className="p-2 bg-surface-container/90 rounded-lg hover:bg-primary/20 transition-colors"><Edit3 className="w-4 h-4 text-on-surface" /></button>
                  <button onClick={() => toggleFeatured(img.id)} className={`p-2 rounded-lg transition-colors ${img.featured ? 'bg-primary/20' : 'bg-surface-container/90'}`}><Star className={`w-4 h-4 ${img.featured ? 'text-yellow-400 fill-current' : 'text-on-surface'}`} /></button>
                  <button onClick={() => deleteImage(img.id)} className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </div>
                {img.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full">★ Featured</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-cream-contrast truncate">{img.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${img.category === 'Wedding' ? 'bg-pink-500/10 text-pink-400' : img.category === 'Birthday' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>{img.category}</span>
                  <span className="text-[10px] text-on-surface-variant">{img.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant">Order</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant hidden lg:table-cell">Tags</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((img, i) => (
                <tr key={img.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => moveUp(i)} disabled={i === 0} className="text-xs text-on-surface-variant hover:text-primary disabled:opacity-30">▲</button>
                      <button onClick={() => moveDown(i)} disabled={i === filtered.length - 1} className="text-xs text-on-surface-variant hover:text-primary disabled:opacity-30">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden">
                      {img.url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🖼️</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-cream-contrast">{img.title}</p>
                    <p className="text-xs text-on-surface-variant truncate max-w-[200px]">{img.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${img.category === 'Wedding' ? 'bg-pink-500/10 text-pink-400' : img.category === 'Birthday' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>{img.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {img.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[10px] bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(img)} className="p-1.5 hover:bg-surface-container-high rounded transition"><Edit3 className="w-4 h-4 text-on-surface-variant" /></button>
                      <button onClick={() => toggleFeatured(img.id)} className="p-1.5 hover:bg-surface-container-high rounded transition"><Star className={`w-4 h-4 ${img.featured ? 'text-yellow-400 fill-current' : 'text-on-surface-variant'}`} /></button>
                      <button onClick={() => deleteImage(img.id)} className="p-1.5 hover:bg-red-500/10 rounded transition"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-surface-container border border-outline-variant rounded-xl">
          <span className="text-5xl block mb-4">📷</span>
          <p className="text-on-surface-variant mb-4">No images in this category</p>
          <button onClick={openNew} className="text-primary hover:text-primary-container font-semibold text-sm">+ Add your first image</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cream-contrast font-display">{editing ? 'Edit Image' : 'Add Image'}</h3>

            {/* Image Upload */}
            <div>
              <label className="text-xs text-on-surface-variant font-medium mb-1 block">Photo</label>
              <DragDropImage
                uploadFolder="gallery"
                value={form.url}
                onChange={(url) => setForm({ ...form, url })}
                placeholder="Drag & drop gallery image"
                aspectRatio="square"
                maxSizeMB={5}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm" placeholder="e.g. Royal Wedding Mandap" />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm resize-none" placeholder="Describe this photo..." />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant font-medium">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm">
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant font-medium">Event Type</label>
                  <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm">
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="pasni">Pasni</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="haldi">Haldi & Mehendi</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-medium">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface text-sm" placeholder="wedding, mandap, floral" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-outline-variant" />
                <span className="text-sm text-on-surface">Featured on homepage</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={saveImage} disabled={!form.title} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50 flex items-center gap-2">
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Image</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
