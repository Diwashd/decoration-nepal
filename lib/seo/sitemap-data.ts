// Dynamic sitemap data - auto-updated when content changes
// This file is the source of truth for sitemap entries

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  isActive: boolean;
  category: 'page' | 'event_type' | 'package' | 'blog' | 'destination';
}

const BASE_URL = 'https://decorationnepal.com';

// Default entries - always included
export const defaultSitemapEntries: SitemapEntry[] = [
  {
    url: BASE_URL,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 1.0,
    isActive: true,
    category: 'page',
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
    isActive: true,
    category: 'page',
  },
  {
    url: `${BASE_URL}/services`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.9,
    isActive: true,
    category: 'page',
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.8,
    isActive: true,
    category: 'page',
  },
  {
    url: `${BASE_URL}/planner`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.9,
    isActive: true,
    category: 'page',
  },
  {
    url: `${BASE_URL}/my-events`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
    isActive: true,
    category: 'page',
  },
];

// Event type entries
export const eventTypeEntries: SitemapEntry[] = [
  { url: `${BASE_URL}/wedding-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/birthday-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/anniversary-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/pasni-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.8, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/haldi-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/mehendi-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/engagement-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/proposal-setup`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/baby-shower-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
  { url: `${BASE_URL}/corporate-event-decoration`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'event_type' },
];

// Destination entries
export const destinationEntries: SitemapEntry[] = [
  { url: `${BASE_URL}/destinations`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.9, isActive: true, category: 'destination' },
];

// Blog entries (auto-populated from published posts)
export const blogEntries: SitemapEntry[] = [
  { url: `${BASE_URL}/blog`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.7, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/wedding-decoration-trends-nepal-2026`, lastModified: '2026-08-15', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/plan-perfect-birthday-party-kathmandu`, lastModified: '2026-08-10', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/pasni-ceremony-decoration-ideas`, lastModified: '2026-08-05', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/choosing-venue-party-palaces-vs-hotels`, lastModified: '2026-07-28', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/anniversary-celebration-ideas`, lastModified: '2026-07-20', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
  { url: `${BASE_URL}/blog/haldi-mehendi-pre-wedding-guide`, lastModified: '2026-07-15', changeFrequency: 'monthly', priority: 0.6, isActive: true, category: 'blog' },
];

// All entries combined
export const allSitemapEntries: SitemapEntry[] = [
  ...defaultSitemapEntries,
  ...eventTypeEntries,
  ...destinationEntries,
  ...blogEntries,
];

// Helper to update lastModified when content changes
export function updateSitemapEntry(url: string): void {
  const entry = allSitemapEntries.find((e) => e.url === url);
  if (entry) {
    entry.lastModified = new Date().toISOString();
  }
}

// Helper to add a new entry
export function addSitemapEntry(entry: SitemapEntry): void {
  const exists = allSitemapEntries.find((e) => e.url === entry.url);
  if (!exists) {
    allSitemapEntries.push(entry);
  }
}

// Helper to remove an entry
export function removeSitemapEntry(url: string): void {
  const index = allSitemapEntries.findIndex((e) => e.url === url);
  if (index > -1) {
    allSitemapEntries.splice(index, 1);
  }
}

// Helper to toggle entry active status
export function toggleSitemapEntry(url: string): void {
  const entry = allSitemapEntries.find((e) => e.url === url);
  if (entry) {
    entry.isActive = !entry.isActive;
  }
}
