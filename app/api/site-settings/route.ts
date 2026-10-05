import { NextResponse } from 'next/server';
import { getBrandingSettings, getHeroSlides } from '@/lib/settings';

export async function GET() {
  const [branding, heroSlides] = await Promise.all([getBrandingSettings(), getHeroSlides()]);
  return NextResponse.json({ success: true, branding, heroSlides }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
