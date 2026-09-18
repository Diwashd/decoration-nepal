import type { MetadataRoute } from 'next';
import { allSitemapEntries } from '@/lib/seo/sitemap-data';

export default function sitemap(): MetadataRoute.Sitemap {
  return allSitemapEntries
    .filter((entry) => entry.isActive)
    .map((entry) => ({
      url: entry.url,
      lastModified: new Date(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
}
