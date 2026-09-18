'use client';

import { useEffect, useCallback } from 'react';

const BASE_URL = 'https://decorationnepal.com';

interface SitemapUpdateOptions {
  url: string;
  action: 'add' | 'update' | 'remove';
  category?: string;
  changeFrequency?: string;
  priority?: number;
}

// Notify the server to update sitemap
async function notifySitemapChange(options: SitemapUpdateOptions): Promise<boolean> {
  try {
    const response = await fetch('/api/sitemap/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    return response.ok;
  } catch {
    // Silently fail — sitemap will update on next build
    return false;
  }
}

// Hook for blog post sitemap auto-update
export function useBlogSitemapUpdate() {
  const onPublish = useCallback(async (slug: string, title: string) => {
    await notifySitemapChange({
      url: `${BASE_URL}/blog/${slug}`,
      action: 'add',
      category: 'blog',
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }, []);

  const onUnpublish = useCallback(async (slug: string) => {
    await notifySitemapChange({
      url: `${BASE_URL}/blog/${slug}`,
      action: 'remove',
    });
  }, []);

  const onUpdate = useCallback(async (oldSlug: string, newSlug: string) => {
    if (oldSlug !== newSlug) {
      await notifySitemapChange({ url: `${BASE_URL}/blog/${oldSlug}`, action: 'remove' });
      await notifySitemapChange({ url: `${BASE_URL}/blog/${newSlug}`, action: 'add', category: 'blog' });
    } else {
      await notifySitemapChange({ url: `${BASE_URL}/blog/${newSlug}`, action: 'update' });
    }
  }, []);

  return { onPublish, onUnpublish, onUpdate };
}

// Hook for package sitemap auto-update
export function usePackageSitemapUpdate() {
  const onPublish = useCallback(async (slug: string) => {
    await notifySitemapChange({
      url: `${BASE_URL}/packages/${slug}`,
      action: 'add',
      category: 'package',
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }, []);

  const onUnpublish = useCallback(async (slug: string) => {
    await notifySitemapChange({
      url: `${BASE_URL}/packages/${slug}`,
      action: 'remove',
    });
  }, []);

  return { onPublish, onUnpublish };
}

// Notify search engines of sitemap changes
export async function pingSearchEngines(): Promise<void> {
  try {
    await fetch(`https://www.google.com/ping?sitemap=${BASE_URL}/sitemap.xml`);
    await fetch(`https://www.bing.com/ping?sitemap=${BASE_URL}/sitemap.xml`);
  } catch {
    // Silently fail
  }
}
