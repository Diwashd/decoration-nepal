'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Search, Star, Users, DollarSign, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import DragDropImage from '@/components/ui/DragDropImage';
import type { AdminStoreDestination } from '@/lib/store/admin-store';

const defaultDestinations = [
  { id: '1', name: 'HOTEL & RESTAURANT SHREE LEKHA', location: 'Thamel, Kathmandu', type: 'hotel', capacity: '50-500 guests', priceRange: 'Rs. 1,50,000 - Rs. 8,00,000', rating: 4.8, image: '/images/destinations/three-lekha.jpg', active: true, featured: true, description: 'Premium hotel and restaurant in the heart of Thamel with state-of-the-art banquet halls and rooftop event space.', amenities: ['Banquet Hall', 'Rooftop', 'Parking', 'Catering', 'AC', 'Sound System'], contact: '+977-1-4423456' },
  { id: '2', name: 'CHhyaChaa RESTAURANT & BANQUET', location: 'Jhamsikhel, Lalitpur', type: 'hotel', capacity: '30-300 guests', priceRange: 'Rs. 1,20,000 - Rs. 6,00,000', rating: 4.6, image: '/images/destinations/chhyachaa.jpg', active: true, featured: true, description: 'Elegant banquet halls with traditional Newari architecture and modern amenities in Jhamsikhel.', amenities: ['Indoor Hall', 'Garden', 'Parking', 'Catering', 'AC'], contact: '+977-1-5534567' },
  { id: '3', name: 'APART HOTEL & RESTAURANT MONSOON', location: 'Patan, Lalitpur', type: 'hotel', capacity: '40-400 guests', priceRange: 'Rs. 1,80,000 - Rs. 7,50,000', rating: 4.7, image: '/images/destinations/monsoon.jpg', active: true, featured: true, description: 'Contemporary hotel with versatile event spaces, stunning courtyard, and premium catering.', amenities: ['Courtyard', 'Banquet Hall', 'Parking', 'Catering', 'AC', 'Pool'], contact: '+977-1-5545678' },
  { id: '4', name: 'HOTEL & RESTAURANT CLASSIC DIAMOND', location: 'Putalisadak, Kathmandu', type: 'hotel', capacity: '60-600 guests', priceRange: 'Rs. 2,00,000 - Rs. 10,00,000', rating: 4.9, image: '/images/destinations/classic-diamond.jpg', active: true, featured: true, description: 'One of Kathmandu\'s premier event venues with multiple halls, grand ballroom, and premium services.', amenities: ['Grand Ballroom', 'Multiple Halls', 'Parking', 'Catering', 'AC', 'Sound System', 'Stage'], contact: '+977-1-4256789' },
  { id: '5', name: 'BATASIA RESTAURANT & BANQUET', location: 'New Baneshwor, Kathmandu', type: 'hotel', capacity: '25-250 guests', priceRange: 'Rs. 80,000 - Rs. 4,00,000', rating: 4.4, image: '/images/destinations/batasia.jpg', active: true, featured: false, description: 'Cozy banquet space with excellent food and affordable packages for medium-sized events.', amenities: ['Banquet Hall', 'Parking', 'Catering', 'AC'], contact: '+977-1-4789012' },
  { id: '6', name: 'GOLDEN GATE RESTAURANT & BANQUET', location: 'Dillibazar, Kathmandu', type: 'restaurant', capacity: '30-200 guests', priceRange: 'Rs. 60,000 - Rs. 3,00,000', rating: 4.3, image: '/images/destinations/golden-gate.jpg', active: true, featured: false, description: 'Budget-friendly venue with great food and flexible setup for intimate celebrations.', amenities: ['Indoor Dining', 'Private Room', 'Catering', 'AC'], contact: '+977-1-4434567' },
  { id: '7', name: 'HOTEL & RESTAURANT JHAPTEK', location: 'Maharajgunj, Kathmandu', type: 'hotel', capacity: '40-350 guests', priceRange: 'Rs. 1,30,000 - Rs. 5,50,000', rating: 4.5, image: '/images/destinations/jhaptek.jpg', active: true, featured: false, description: 'Well-appointed venue in Maharajgunj with modern facilities and professional event management.', amenities: ['Banquet Hall', 'Lawn', 'Parking', 'Catering', 'AC', 'Sound System'], contact: '+977-1-4512345' },
  { id: '8', name: 'GORKHA KULFI', location: 'Boudha, Kathmandu', type: 'restaurant', capacity: '20-100 guests', priceRange: 'Rs. 30,000 - Rs. 1,50,000', rating: 4.2, image: '/images/destinations/gorkha-kulfi.jpg', active: true, featured: false, description: 'Quaint venue near Boudhanath Stupa, perfect for intimate gatherings and cultural celebrations.', amenities: ['Outdoor Seating', 'Catering', 'Cultural Ambiance'], contact: '+977-1-4912345' },
  { id: '9', name: 'HOTEL & RESTAURANT JHANKI', location: 'Lagankhel, Lalitpur', type: 'hotel', capacity: '35-300 guests', priceRange: 'Rs. 1,00,000 - Rs. 4,50,000', rating: 4.4, image: '/images/destinations/jhanki.jpg', active: true, featured: false, description: 'Traditional hospitality meets modern amenities in this Lagankhel venue with excellent banquet facilities.', amenities: ['Banquet Hall', 'Garden', 'Parking', 'Catering', 'AC'], contact: '+977-1-5523456' },
  { id: '10', name: 'RARE HAVEN RESTAURANT & BANQUET', location: 'Sanepa, Lalitpur', type: 'restaurant', capacity: '25-200 guests', priceRange: 'Rs. 90,000 - Rs. 3,80,000', rating: 4.5, image: '/images/destinations/rare-haven.jpg', active: true, featured: false, description: 'Boutique event space with stunning decor and personalized service for memorable celebrations.', amenities: ['Indoor/Outdoor', 'Catering', 'AC', 'Decor Included'], contact: '+977-1-5545679' },
];

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<AdminStoreDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'hotel' | 'banquet' | 'party_palace' | 'restaurant'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof defaultDestinations[0] | null>(null);
  const [form, setForm] = useState({
    name: '', location: '', type: 'hotel', capacity: '', priceRange: '',
    description: '', contact: '', amenities: '', featured: false, image: '' as string, order: 0,
  });

  useEffect(() => {
    fetch('/api/admin/destinations')
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Failed to load destinations');
        setDestinations(result.destinations);
      })
      .catch(error => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = destinations.filter(
    (d) => (filter === 'all' || d.type === filter) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()))
  );

  const openEdit = (d: typeof defaultDestinations[0]) => {
    setEditing(d);
    setForm({ name: d.name, location: d.location, type: d.type, capacity: d.capacity, priceRange: d.priceRange, description: d.description, contact: d.contact, amenities: d.amenities.join(', '), featured: d.featured, image: d.image || '', order: (d as typeof d & { order?: number }).order ?? Number(d.id) });
    setShowModal(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', location: '', type: 'hotel', capacity: '', priceRange: '', description: '', contact: '', amenities: '', featured: false, image: '', order: destinations.length + 1 });
    setShowModal(true);
  };

  const saveDestination = async () => {
    const payload = { ...form, amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean), ...(editing ? { id: editing.id } : {}) };
    const response = await fetch('/api/admin/destinations', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok || !result.success) return;
    setDestinations(editing ? destinations.map(d => d.id === editing.id ? result.destination : d) : [...destinations, result.destination]);
    setShowModal(false);
  };

  const toggleActive = async (id: string) => {
    const destination = destinations.find(item => item.id === id);
    if (!destination) return;
    const response = await fetch('/api/admin/destinations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !destination.active }) });
    const result = await response.json();
    if (response.ok && result.success) setDestinations(destinations.map(item => item.id === id ? result.destination : item));
  };

  const deleteDestination = async (id: string) => {
    if (!confirm('Delete this destination?')) return;
    const response = await fetch(`/api/admin/destinations?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok) setDestinations(destinations.map(item => item.id === id ? { ...item, active: false } : item));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Destinations</h1>
          <p className="text-on-surface-variant mt-1">Manage your venues and party palaces</p>
        </div>
        <div className="flex gap-3">
          <Link href="/destinations" target="_blank" className="flex items-center gap-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-sm">
            <ExternalLink className="w-4 h-4" /> View Frontend
          </Link>
          <button onClick={openNew} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary-fixed transition-colors">
            <Plus className="w-4 h-4" /> Add Destination
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: 'Total', value: destinations.length, color: 'text-cream-contrast' },
          { label: 'Hotels', value: destinations.filter(d => d.type === 'hotel').length, color: 'text-blue-400' },
          { label: 'Banquets', value: destinations.filter(d => d.type === 'banquet').length, color: 'text-purple-400' },
          { label: 'Party Palaces', value: destinations.filter(d => d.type === 'party_palace').length, color: 'text-orange-400' },
          { label: 'Restaurants', value: destinations.filter(d => d.type === 'restaurant').length, color: 'text-green-400' },
          { label: 'Featured', value: destinations.filter(d => d.featured).length, color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container border border-outline-variant rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input type="text" placeholder="Search destinations..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2">
          {(['all', 'hotel', 'banquet', 'party_palace', 'restaurant'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface'}`}>
              {f === 'all' ? 'All' : f === 'party_palace' ? 'Party Palaces' : f === 'banquet' ? 'Banquets' : `${f.charAt(0).toUpperCase()}${f.slice(1)}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading && <p className="text-on-surface-variant md:col-span-2">Loading destinations from Supabase...</p>}
        {filtered.map((dest) => (
          <div key={dest.id} className={`bg-surface-container border border-outline-variant rounded-xl overflow-hidden transition-all hover:border-primary/30 ${!dest.active ? 'opacity-60' : ''}`}>
            <div className="h-40 bg-surface-container-high flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant">{dest.location}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-cream-contrast">{dest.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${dest.type === 'hotel' ? 'bg-blue-500/10 text-blue-400' : dest.type === 'banquet' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {dest.type === 'hotel' ? '🏨' : dest.type === 'banquet' ? '🎪' : '🎉'} {dest.type.replace('_', ' ')}
                    </span>
                    {dest.featured && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Featured</span>}
                    <span className="text-xs text-on-surface-variant flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {dest.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant mb-2 line-clamp-2">{dest.description}</p>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {dest.capacity}</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {dest.priceRange}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {dest.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">{a}</span>
                ))}
                {dest.amenities.length > 4 && <span className="text-xs text-on-surface-variant">+{dest.amenities.length - 4}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(dest)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface hover:text-cream-contrast transition-colors">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => toggleActive(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                  {dest.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {dest.active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => deleteDestination(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors ml-auto">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cream-contrast font-display">{editing ? 'Edit Destination' : 'Add Destination'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-on-surface-variant">Venue Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="e.g. Hotel & Restaurant Shree Lekha" />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Venue Image</label>
                <DragDropImage
                  value={form.image || ''}
                  uploadFolder="destinations"
                  onChange={(url) => setForm({ ...form, image: url } as any)}
                  placeholder="Drag & drop venue photo"
                  aspectRatio="video"
                  maxSizeMB={5}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Location</label>
                  <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Thamel, Kathmandu" />
                </div>
                <div className="w-32">
                  <label className="text-xs text-on-surface-variant">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface">
                    <option value="hotel">🏨 Hotel</option>
                    <option value="banquet">🎪 Banquet Hall</option>
                    <option value="party_palace">🎉 Party Palace</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Capacity</label>
                  <input value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="50-500 guests" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Price Range</label>
                  <input value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Rs. 1,50,000 - Rs. 8,00,000" />
                </div>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" placeholder="Describe this venue..." />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Contact</label>
                  <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="+977-1-4423456" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-outline-variant" />
                    <span className="text-sm text-on-surface">Featured</span>
                  </label>
                </div>
              </div>
              <div>
                  <label className="text-xs text-on-surface-variant">Display order</label>
                  <input type="number" min="0" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) || 0 })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface mb-3" />
                  <label className="text-xs text-on-surface-variant">Amenities (comma-separated)</label>
                <input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Banquet Hall, Parking, Catering, AC" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={saveDestination} disabled={!form.name || !form.location} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50">Save Destination</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
