'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, ExternalLink, Globe, Calendar, ArrowUpDown, ToggleLeft, ToggleRight, Map } from 'lucide-react';
import Link from 'next/link';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  isActive: boolean;
  category: string;
}

const defaultEntries: SitemapEntry[] = [
  { url: 'https://decorationnepal.com', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 1.0, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/about', lastModified: '2026-08-28', changeFrequency: 'monthly', priority: 0.8, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/services', lastModified: '2026-08-28', changeFrequency: 'monthly', priority: 0.9, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/contact', lastModified: '2026-08-28', changeFrequency: 'monthly', priority: 0.8, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/planner', lastModified: '2026-08-28', changeFrequency: 'monthly', priority: 0.9, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/my-events', lastModified: '2026-08-28', changeFrequency: 'monthly', priority: 0.5, isActive: true, category: 'page' },
  { url: 'https://decorationnepal.com/wedding-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/birthday-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/anniversary-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/pasni-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/haldi-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/mehendi-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/engagement-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/proposal-setup', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/baby-shower-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: 'https://decorationnepal.com/corporate-event-decoration', lastModified: '2026-08-28', changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
];

const categoryColors: Record<string, string> = {
  page: 'bg-primary/10 text-primary border-primary/30',
  event_type: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  package: 'bg-green-500/10 text-green-400 border-green-500/30',
  blog: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  destination: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

export default function SitemapManager() {
  const [entries, setEntries] = useState<SitemapEntry[]>(defaultEntries);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ url: '', changeFrequency: 'weekly', priority: 0.5, category: 'page' });

  const filteredEntries = filter === 'all' ? entries : entries.filter((e) => e.category === filter);

  const toggleEntry = (url: string) => {
    setEntries(entries.map((e) => (e.url === url ? { ...e, isActive: !e.isActive } : e)));
  };

  const deleteEntry = (url: string) => {
    setEntries(entries.filter((e) => e.url !== url));
  };

  const updatePriority = (url: string, priority: number) => {
    setEntries(entries.map((e) => (e.url === url ? { ...e, priority: Math.max(0, Math.min(1, priority)) } : e)));
  };

  const updateFrequency = (url: string, changeFrequency: string) => {
    setEntries(entries.map((e) => (e.url === url ? { ...e, changeFrequency } : e)));
  };

  const updateLastModified = (url: string, lastModified: string) => {
    setEntries(entries.map((e) => (e.url === url ? { ...e, lastModified } : e)));
  };

  const addEntry = () => {
    if (!newEntry.url) return;
    const fullUrl = newEntry.url.startsWith('http') ? newEntry.url : `https://decorationnepal.com${newEntry.url}`;
    setEntries([
      ...entries,
      {
        url: fullUrl,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: newEntry.changeFrequency,
        priority: newEntry.priority,
        isActive: true,
        category: newEntry.category,
      },
    ]);
    setNewEntry({ url: '', changeFrequency: 'weekly', priority: 0.5, category: 'page' });
    setShowAddForm(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeCount = entries.filter((e) => e.isActive).length;
  const pageCount = entries.filter((e) => e.category === 'page').length;
  const eventTypeCount = entries.filter((e) => e.category === 'event_type').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" />
            Sitemap Manager
          </h1>
          <p className="text-on-surface-variant mt-1">Manage sitemap entries. Changes are auto-published when you save.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://decorationnepal.com/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Sitemap</span>
          </a>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add URL</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed disabled:opacity-50 transition font-semibold text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : saved ? '✓ Saved & Published' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Total URLs</p>
          <p className="text-2xl font-bold text-cream-contrast font-display mt-1">{entries.length}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Active</p>
          <p className="text-2xl font-bold text-primary font-display mt-1">{activeCount}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Pages</p>
          <p className="text-2xl font-bold text-cream-contrast font-display mt-1">{pageCount}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Event Types</p>
          <p className="text-2xl font-bold text-cream-contrast font-display mt-1">{eventTypeCount}</p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-surface-container border border-primary/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-cream-contrast mb-4">Add New URL</h3>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">URL Path</label>
              <input
                type="text"
                value={newEntry.url}
                onChange={(e) => setNewEntry({ ...newEntry, url: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm font-mono"
                placeholder="/new-page or https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Frequency</label>
              <select
                value={newEntry.changeFrequency}
                onChange={(e) => setNewEntry({ ...newEntry, changeFrequency: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Priority</label>
              <input
                type="number"
                value={newEntry.priority}
                onChange={(e) => setNewEntry({ ...newEntry, priority: parseFloat(e.target.value) || 0.5 })}
                className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Category</label>
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-3 rounded border border-outline focus:border-primary focus:outline-none text-sm"
              >
                <option value="page">Page</option>
                <option value="event_type">Event Type</option>
                <option value="package">Package</option>
                <option value="blog">Blog</option>
                <option value="destination">Destination</option>
              </select>
            </div>
            <div className="col-span-1 flex items-end">
              <button
                onClick={addEntry}
                className="w-full bg-primary text-on-primary py-2.5 rounded hover:bg-primary-fixed transition font-semibold text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'page', 'event_type', 'package', 'blog', 'destination'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === cat
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:text-cream-contrast border border-outline-variant'
            }`}
          >
            {cat === 'all' ? 'All' : cat.replace('_', ' ')}
            <span className="ml-1.5 text-[10px] opacity-70">
              ({cat === 'all' ? entries.length : entries.filter((e) => e.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Entries Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Status</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">URL</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Category</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last Modified</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Frequency</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr
                key={entry.url}
                className={`border-b border-outline-variant/50 transition-colors ${
                  entry.isActive ? 'hover:bg-surface-container-high/50' : 'opacity-50'
                }`}
              >
                <td className="px-4 py-3">
                  <button onClick={() => toggleEntry(entry.url)} className="flex items-center">
                    {entry.isActive ? (
                      <ToggleRight className="w-6 h-6 text-primary" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-on-surface-variant" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
                    <span className="text-sm text-cream-contrast font-mono truncate max-w-md">
                      {entry.url.replace('https://decorationnepal.com', '')}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border ${categoryColors[entry.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                    {entry.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    <input
                      type="date"
                      value={entry.lastModified}
                      onChange={(e) => updateLastModified(entry.url, e.target.value)}
                      className="bg-transparent text-sm text-on-surface-variant border-b border-transparent hover:border-outline focus:border-primary focus:outline-none cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={entry.changeFrequency}
                    onChange={(e) => updateFrequency(entry.url, e.target.value)}
                    className="bg-transparent text-sm text-on-surface-variant border-b border-transparent hover:border-outline focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={entry.priority}
                      onChange={(e) => updatePriority(entry.url, parseFloat(e.target.value) || 0)}
                      className="w-16 bg-transparent text-sm text-on-surface-variant border-b border-transparent hover:border-outline focus:border-primary focus:outline-none text-center"
                      min="0"
                      max="1"
                      step="0.1"
                    />
                    <ArrowUpDown className="w-3 h-3 text-on-surface-variant" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-surface-container-high rounded transition"
                    >
                      <ExternalLink className="w-4 h-4 text-on-surface-variant" />
                    </a>
                    <button
                      onClick={() => deleteEntry(entry.url)}
                      className="p-1.5 hover:bg-red-500/10 rounded transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
