import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/services/session';
import { brandingDefaults, getBrandingSettings, getHeroSlides, heroDefaults, saveBrandingSettings, saveHeroSlides } from '@/lib/settings';

const brandingSchema = z.object({
  logo: z.string().trim().max(2048),
  favicon: z.string().trim().max(2048),
  ogImage: z.string().trim().max(2048),
  logoSizePercent: z.number().int().min(50).max(200),
});
const heroSchema = z.array(z.object({
  id: z.string().min(1).max(100),
  image: z.string().trim().min(1).max(2048),
  eyebrow: z.string().trim().max(120),
  heading: z.string().trim().min(1).max(200),
  highlight: z.string().trim().max(200),
  description: z.string().trim().max(500),
})).min(1).max(8);

export async function GET() {
  return NextResponse.json({ success: true, branding: await getBrandingSettings(), heroSlides: await getHeroSlides() }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const branding = brandingSchema.parse(body);
    const heroSlides = heroSchema.parse(body.heroSlides || heroDefaults);
    await saveBrandingSettings({
      logo: branding.logo || brandingDefaults.logo,
      favicon: branding.favicon || brandingDefaults.favicon,
      ogImage: branding.ogImage || brandingDefaults.ogImage,
      logoSizePercent: branding.logoSizePercent,
    });
    await saveHeroSlides(heroSlides);

    return NextResponse.json({ success: true, branding: await getBrandingSettings(), heroSlides: await getHeroSlides() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid branding settings' }, { status: 400 });
    }
    console.error('Failed to save branding settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save branding settings' }, { status: 500 });
  }
}
