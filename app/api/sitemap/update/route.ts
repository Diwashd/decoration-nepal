import { NextRequest, NextResponse } from 'next/server';
import { addSitemapEntry, removeSitemapEntry, updateSitemapEntry } from '@/lib/seo/sitemap-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, action, category, changeFrequency, priority } = body;

    if (!url || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    switch (action) {
      case 'add':
        addSitemapEntry({
          url,
          lastModified: new Date().toISOString(),
          changeFrequency: (changeFrequency || 'weekly') as any,
          priority: priority || 0.5,
          isActive: true,
          category: category || 'page',
        });
        break;

      case 'update':
        updateSitemapEntry(url);
        break;

      case 'remove':
        removeSitemapEntry(url);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sitemap' }, { status: 500 });
  }
}
