import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { systemSettings } from '@/lib/db/schema';

export const brandingDefaults = {
  logo: '/logo.png',
  favicon: '/favicon.ico',
  ogImage: '/og-image.jpg',
  logoSizePercent: 100,
} as const;

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
};

export const heroDefaults: HeroSlide[] = [{
  id: 'default-hero',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAD7mPCb1hYUN9bXHaMlFuL39yVLR-caNZqd8JFmj99fkshd-ba9EgjRUIXAOzRdntLA_RdL8LVZGXyaD7D5SLTlyXfVTp6FImraIFKPrFAymMfSQ-aqNlQ0XTXMgzQtvvmJ0LJMRKr6EzqCVdvWJGt_aLaKZdahYiAfiflL8cwvnNjZrGInFVcAuA_hA_-DOt4cotPTtq_-pQIZ7ihE3Cfvc0oj5nVxXLlosEmA_G9dj2Baxw3QPh-',
  eyebrow: 'Bespoke Events in Nepal',
  heading: 'Elevate Events with',
  highlight: 'Extraordinary Experiences',
  description: 'Crafting turnkey event masterpieces with meticulous attention to luxury, exclusivity, and professional perfection.',
}];

export type BrandingSettings = {
  logo: string;
  favicon: string;
  ogImage: string;
  logoSizePercent: number;
};

export type SiteSettings = BrandingSettings & {
  heroSlides: HeroSlide[];
};

export async function getBrandingSettings(): Promise<BrandingSettings> {
  try {
    const rows = await db
      .select({ id: systemSettings.id, value: systemSettings.value })
      .from(systemSettings)
      .where(eq(systemSettings.id, 'branding'));
    const stored = rows[0]?.value;

    if (!stored) {
      return { ...brandingDefaults };
    }

    const parsed: Partial<BrandingSettings> = JSON.parse(stored);
    return {
      logo: typeof parsed.logo === 'string' ? parsed.logo : brandingDefaults.logo,
      favicon: typeof parsed.favicon === 'string' ? parsed.favicon : brandingDefaults.favicon,
      ogImage: typeof parsed.ogImage === 'string' ? parsed.ogImage : brandingDefaults.ogImage,
      logoSizePercent: typeof parsed.logoSizePercent === 'number'
        ? Math.min(200, Math.max(50, parsed.logoSizePercent))
        : brandingDefaults.logoSizePercent,
    };
  } catch (error) {
    console.error('Failed to load branding settings:', error);
    return { ...brandingDefaults };
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const rows = await db.select({ value: systemSettings.value }).from(systemSettings).where(eq(systemSettings.id, 'hero'));
    if (!rows[0]?.value) return heroDefaults;
    const parsed = JSON.parse(rows[0].value);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : heroDefaults;
  } catch (error) {
    console.error('Failed to load hero slides:', error);
    return heroDefaults;
  }
}

export async function saveHeroSlides(slides: HeroSlide[]): Promise<void> {
  await db.insert(systemSettings).values({
    id: 'hero',
    value: JSON.stringify(slides),
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: systemSettings.id,
    set: { value: JSON.stringify(slides), updatedAt: new Date() },
  });
}

export async function saveBrandingSettings(settings: BrandingSettings): Promise<void> {
  await db
    .insert(systemSettings)
    .values({
      id: 'branding',
      value: JSON.stringify(settings),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: systemSettings.id,
      set: {
        value: JSON.stringify(settings),
        updatedAt: new Date(),
      },
    });
}
