'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, MapPin, GripVertical, Eye, EyeOff, Save, Check } from 'lucide-react';

const defaultDestinations = [
  { id: '1', name: 'Hotel & Restaurant Shree Lekha', location: 'Thamel, Kathmandu', type: 'hotel', featured: true, rating: 4.8, capacity: '50-500' },
  { id: '2', name: 'ChhyaChaa Restaurant & Banquet', location: 'Jhamsikhel, Lalitpur', type: 'restaurant', featured: true, rating: 4.6, capacity: '30-300' },
  { id: '3', name: 'Apart Hotel & Restaurant Monsoon', location: 'Patan, Lalitpur', type: 'hotel', featured: true, rating: 4.7, capacity: '40-400' },
  { id: '4', name: 'Hotel & Restaurant Classic Diamond', location: 'Putalisadak, Kathmandu', type: 'hotel', featured: true, rating: 4.9, capacity: '60-600' },
  { id: '5', name: 'Batasia Restaurant & Banquet', location: 'New Baneshwor, Kathmandu', type: 'restaurant', featured: false, rating: 4.4, capacity: '25-250' },
  { id: '6', name: 'Golden Gate Restaurant & Banquet', location: 'Dillibazar, Kathmandu', type: 'restaurant', featured: false, rating: 4.3, capacity: '30-200' },
  { id: '7', name: 'Hotel & Restaurant Jhaptek', location: 'Maharajgunj, Kathmandu', type: 'hotel', featured: false, rating: 4.5, capacity: '40-350' },
  { id: '8', name: 'Gorkha Kulfi', location: 'Boudha, Kathmandu', type: 'restaurant', featured: false, rating: 4.2, capacity: '20-100' },
  { id: '9', name: 'Hotel & Restaurant Jhanki', location: 'Lagankhel, Lalitpur', type: 'hotel', featured: false, rating: 4.4, capacity: '35-300' },
  { id: '10', name: 'Rare Haven Restaurant & Banquet', location: 'Sanepa, Lalitpur', type: 'restaurant', featured: false, rating: 4.5, capacity: '25-200' },
];

export default function AdminFeaturedDestinationsPage() {
  const [destinations, setDestinations] = useState(defaultDestinations);
  const [saved, setSaved] = useState(false);

  const toggleFeatured = (id: string) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, featured: !d.featured } : d));
    setSaved(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const arr = [...destinations];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setDestinations(arr);
    setSaved(false);
  };

  const moveDown = (index: number) => {
    if (index >= destinations.length - 1) return;
    const arr = [...destinations];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setDestinations(arr);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const featured = destinations.filter(d => d.featured);
  const nonFeatured = destinations.filter(d => !d.featured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/destinations" className="flex items-center gap-2 text-on-surface-variant hover:text-cream-contrast text-sm transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Featured Destinations</h1>
          <p className="text-on-surface-variant mt-1">Choose which venues appear on the homepage and blog sidebar</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-fixed transition-colors">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      {/* Preview Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-sm text-on-surface-variant">
          <strong className="text-primary">{featured.length} destinations</strong> will be displayed on the <Link href="/" className="text-primary hover:underline">homepage</Link> and in the <Link href="/blog/wedding-decoration-trends-nepal-2026" className="text-primary hover:underline">blog sidebar</Link>.
        </p>
      </div>

      {/* Featured Section */}
      <div>
        <h2 className="text-lg font-bold text-cream-contrast mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Featured on Homepage ({featured.length})
        </h2>
        <div className="space-y-2">
          {featured.map((dest, i) => (
            <div key={dest.id} className="bg-surface-container border border-primary/20 rounded-xl p-4 flex items-center gap-4 hover:border-primary/40 transition-colors">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(i)} disabled={i === 0} className="text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors text-xs">▲</button>
                <button onClick={() => moveDown(i)} disabled={i === featured.length - 1} className="text-on-surface-variant hover:text-primary disabled:opacity-30 transition-colors text-xs">▼</button>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">#{i + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-cream-contrast truncate">{dest.name}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {dest.location}
                  <span className="mx-1">·</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" /> {dest.rating}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${dest.type === 'hotel' ? 'bg-blue-500/10 text-blue-400' : dest.type === 'banquet' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>{dest.type === 'hotel' ? '🏨' : dest.type === 'banquet' ? '🎪' : '🎉'} {dest.type.replace('_', ' ')}</span>
              <button onClick={() => toggleFeatured(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-colors">
                <EyeOff className="w-3 h-3" /> Remove
              </button>
            </div>
          ))}
          {featured.length === 0 && (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No featured destinations selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Non-Featured Section */}
      <div>
        <h2 className="text-lg font-bold text-cream-contrast mb-4 flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-on-surface-variant" />
          Available to Feature ({nonFeatured.length})
        </h2>
        <div className="space-y-2">
          {nonFeatured.map((dest) => (
            <div key={dest.id} className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-cream-contrast truncate">{dest.name}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {dest.location}
                  <span className="mx-1">·</span>
                  {dest.capacity} guests
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${dest.type === 'hotel' ? 'bg-blue-500/10 text-blue-400' : dest.type === 'banquet' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>{dest.type === 'hotel' ? '🏨' : dest.type === 'banquet' ? '🎪' : '🎉'} {dest.type.replace('_', ' ')}</span>
              <button onClick={() => toggleFeatured(dest.id)} className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs hover:bg-primary/20 transition-colors">
                <Eye className="w-3 h-3" /> Feature
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
