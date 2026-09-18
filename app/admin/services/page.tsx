'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import DragDropImage from '@/components/ui/DragDropImage';

const defaultServices = [
  { id: '1', name: 'Event Decoration', category: 'core', description: 'Complete event decoration with floral arrangements, stage setup, backdrop designs, and themed decor.', price: 'From Rs. 25,000', active: true, icon: '🎨', featured: true, order: 1 },
  { id: '2', name: 'Venue Finding', category: 'core', description: 'We help you discover and book the perfect venue for your event from our curated list of premium venues.', price: 'Free Service', active: true, icon: '🏛️', featured: true, order: 2 },
  { id: '3', name: 'Photo & Video', category: 'core', description: 'Professional photography and videography services to capture every precious moment of your event.', price: 'From Rs. 35,000', active: true, icon: '📸', featured: true, order: 3 },
  { id: '4', name: 'Makeup Artist', category: 'core', description: 'Expert makeup artists for bridal, party, and special occasion looks using premium products.', price: 'From Rs. 15,000', active: true, icon: '💄', featured: true, order: 4 },
  { id: '5', name: 'Band & Music', category: 'core', description: 'Live band performances, DJ services, and musical entertainment for all types of celebrations.', price: 'From Rs. 20,000', active: true, icon: '🎵', featured: true, order: 5 },
  { id: '6', name: 'Catering', category: 'core', description: 'Premium catering services with customizable menus from traditional Nepali to international cuisines.', price: 'From Rs. 800/head', active: true, icon: '🍽️', featured: true, order: 6 },
  { id: '7', name: 'Car Decoration', category: 'additional', description: 'Beautiful car decoration for wedding processions with flowers, ribbons, and lights.', price: 'From Rs. 5,000', active: true, icon: '🚗', featured: false, order: 7 },
  { id: '8', name: 'Sound System', category: 'additional', description: 'Professional sound system rental with speakers, microphones, and audio equipment.', price: 'From Rs. 8,000', active: true, icon: '🔊', featured: false, order: 8 },
  { id: '9', name: 'DJ Lights', category: 'additional', description: 'Professional DJ setup with lighting effects, dance floor illumination, and party atmosphere.', price: 'From Rs. 12,000', active: true, icon: '💡', featured: false, order: 9 },
  { id: '10', name: 'Baggi Service', category: 'additional', description: 'Traditional horse-drawn carriage for grand wedding arrivals and special processions.', price: 'From Rs. 15,000', active: true, icon: '🐎', featured: false, order: 10 },
  { id: '11', name: 'Proposal Setup', category: 'additional', description: 'Romantic proposal arrangements with flowers, candles, personalized decor, and photographer.', price: 'From Rs. 10,000', active: true, icon: '💍', featured: false, order: 11 },
  { id: '12', name: 'Kisti Gift Tray', category: 'additional', description: 'Beautifully arranged gift trays with traditional items for engagement and ceremony rituals.', price: 'From Rs. 3,000', active: true, icon: '🎁', featured: false, order: 12 },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<typeof defaultServices>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'core' | 'additional'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<typeof defaultServices[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'core', description: '', price: '', icon: '✨', featured: false, image: '', active: true, order: 0 });

  useEffect(() => {
    fetch('/api/admin/services')
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Failed to load services');
        setServices(result.services);
      })
      .catch(loadError => {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load services');
        setServices(defaultServices);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = services.filter(
    (s) =>
      (filter === 'all' || s.category === filter) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (service: typeof defaultServices[0]) => {
    setEditingService(service);
    setForm({ name: service.name, category: service.category, description: service.description, price: service.price, icon: service.icon, featured: service.featured, image: (service as typeof service & { image?: string }).image || '', active: service.active, order: service.order });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingService(null);
    setForm({ name: '', category: 'core', description: '', price: '', icon: '✨', featured: false, image: '', active: true, order: services.length + 1 });
    setShowModal(true);
  };

  const saveService = async () => {
    setIsSaving(true);
    // Extract numeric value from price string (e.g., "From Rs. 15,000" -> 15000)
    const basePrice = Number(form.price.replace(/[^0-9]/g, '')) || 0;
    const payload = {
      ...(editingService ? { id: editingService.id } : {}),
      name: form.name,
      category: form.category,
      description: form.description,
      basePrice,
      icon: form.icon,
      featured: form.featured,
      active: form.active,
      order: form.order,
      image: form.image,
    };
    const response = await fetch('/api/admin/services', {
      method: editingService ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setIsSaving(false);
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to save service');
      return;
    }
    if (editingService) {
      setServices(services.map(service => service.id === editingService.id ? result.service : service));
    } else {
      setServices([result.service, ...services]);
    }
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleActive = async (id: string) => {
    const service = services.find(item => item.id === id);
    if (!service) return;
    const response = await fetch('/api/admin/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: service.id, active: !service.active }),
    });
    const result = await response.json();
    if (response.ok && result.success) setServices(services.map(item => item.id === id ? result.service : item));
  };

  const deleteService = async (id: string) => {
    if (confirm('Delete this service?')) {
      const response = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (response.ok) setServices(services.map(service => service.id === id ? { ...service, active: false } : service));
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-300">
          ✓ Service saved successfully!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Services</h1>
          <p className="text-on-surface-variant mt-1">Manage your event services</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'core', 'additional'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${filter === f ? 'bg-primary text-on-primary hover:scale-105' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50'}`}
            >
              {f === 'all' ? 'All' : f === 'core' ? 'Core' : 'Additional'}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && <p className="text-on-surface-variant md:col-span-2 lg:col-span-3">Loading services from Supabase...</p>}
        {error && <p className="text-red-400 md:col-span-2 lg:col-span-3">{error}</p>}
        {filtered.map((service) => (
          <div key={service.id} className={`bg-surface-container border border-outline-variant rounded-xl p-5 transition-all hover:border-primary/30 ${!service.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h3 className="font-semibold text-cream-contrast">{service.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${service.category === 'core' ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-400'}`}>
                    {service.category}
                  </span>
                </div>
              </div>
              {service.featured && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>
              )}
            </div>
            <p className="text-sm text-on-surface mb-3 line-clamp-2">{service.description}</p>
            <p className="text-sm text-primary font-semibold mb-4">{service.price}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => openEdit(service)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface hover:text-cream-contrast hover:bg-surface-container-highest transition-all cursor-pointer">
                <Edit3 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => toggleActive(service.id)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface hover:text-cream-contrast hover:bg-surface-container-highest transition-all cursor-pointer">
                {service.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {service.active ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => deleteService(service.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer ml-auto">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cream-contrast font-display">{editingService ? 'Edit Service' : 'Add Service'}</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="text-xs text-on-surface-variant">Icon</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-2xl text-center" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Service name" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface">
                    <option value="core">Core</option>
                    <option value="additional">Additional</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Price</label>
                  <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="From Rs. X" />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" placeholder="Service description..." />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Service Image</label>
                <DragDropImage
                  value={form.image}
                  uploadFolder="services"
                  onChange={(url) => setForm({ ...form, image: url })}
                  placeholder="Drag & drop service image"
                  aspectRatio="video"
                  maxSizeMB={5}
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-outline-variant" />
                <span className="text-sm text-on-surface">Featured on homepage</span>
              </label>
              <div>
                <label className="text-xs text-on-surface-variant">Display order</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) || 0 })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="rounded border-outline-variant" />
                <span className="text-sm text-on-surface">Active and visible in quotations</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer">Cancel</button>
              <button onClick={saveService} disabled={!form.name || isSaving} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {isSaving ? 'Saving...' : 'Save Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
