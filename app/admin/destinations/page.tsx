'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Search, Star, Users, DollarSign, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { AdminStoreDestination } from '@/lib/store/admin-store';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<AdminStoreDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'hotel' | 'banquet' | 'party_palace' | 'restaurant'>('all');

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
      {/* Success Notification */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Destinations</h1>
          <p className="text-on-surface-variant mt-1">Manage your venues and party palaces</p>
        </div>
        <div className="flex gap-3">
          <Link href="/destinations" target="_blank" className="flex items-center gap-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-sm cursor-pointer">
            <ExternalLink className="w-4 h-4" /> View Frontend
          </Link>
          <Link href="/admin/destinations/new" className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all">
            <Plus className="w-4 h-4" /> Add Destination
          </Link>
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
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${filter === f ? 'bg-primary text-on-primary hover:scale-105' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50'}`}>
              {f === 'all' ? 'All' : f === 'party_palace' ? 'Party Palaces' : f === 'banquet' ? 'Banquets' : `${f.charAt(0).toUpperCase()}${f.slice(1)}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {isLoading && <p className="text-on-surface-variant md:col-span-2">Loading destinations from Supabase...</p>}
        {filtered.map((dest) => (
          <div key={dest.id} className={`bg-surface-container border border-outline-variant rounded-xl overflow-hidden transition-all hover:border-primary/30 ${!dest.active ? 'opacity-60' : ''}`}>
            <div className="relative h-40 overflow-hidden bg-surface-container-high flex items-center justify-center">
              {dest.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={dest.image} alt={`${dest.name} venue`} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-8">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-white">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="truncate">{dest.location}</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="text-sm text-on-surface-variant">{dest.location}</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-cream-contrast">{dest.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`hidden text-xs px-2 py-0.5 rounded-full md:inline-flex ${dest.type === 'hotel' ? 'bg-blue-500/10 text-blue-400' : dest.type === 'banquet' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {dest.type === 'hotel' ? '🏨' : dest.type === 'banquet' ? '🎪' : '🎉'} {dest.type.replace('_', ' ')}
                    </span>
                    {dest.featured && <span className="hidden text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full md:inline-flex">Featured</span>}
                    <span className="text-xs text-on-surface-variant flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> {dest.rating}</span>
                  </div>
                </div>
              </div>
              <p className="hidden text-sm text-on-surface-variant mb-2 line-clamp-2 md:block">{dest.description}</p>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {dest.capacity}</span>
                <span className="hidden items-center gap-1 md:flex"><DollarSign className="w-3 h-3" /> {dest.priceRange}</span>
              </div>
              <div className="hidden flex-wrap gap-1 mb-3 md:flex">
                {dest.amenities.slice(0, 4).map((a) => (
                  <span key={a} className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">{a}</span>
                ))}
                {dest.amenities.length > 4 && <span className="text-xs text-on-surface-variant">+{dest.amenities.length - 4}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/destinations/${dest.id}`} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface hover:text-cream-contrast hover:bg-surface-container-highest transition-all">
                  <Edit3 className="w-3 h-3" /> Edit
                </Link>
                <button onClick={() => toggleActive(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer">
                  {dest.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {dest.active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => deleteDestination(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer ml-auto">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
