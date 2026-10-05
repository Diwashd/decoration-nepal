'use client';

import { useEffect, useState } from 'react';
import { Settings, Save, Building, Phone, Globe, Image as ImageIcon, Shield, Bell } from 'lucide-react';
import DragDropImage from '@/components/ui/DragDropImage';
import type { HeroSlide } from '@/lib/settings';

const brandingDefaults = {
  logo: '/logo.png',
  favicon: '/favicon.ico',
  ogImage: '/og-image.jpg',
  logoSizePercent: 100,
};
const defaultHeroSlides: HeroSlide[] = [{
  id: 'default-hero',
  image: '',
  eyebrow: 'Bespoke Events in Nepal',
  heading: 'Elevate Events with',
  highlight: 'Extraordinary Experiences',
  description: 'Crafting turnkey event masterpieces with meticulous attention to luxury, exclusivity, and professional perfection.',
}];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: '11:11 Decoration Nepal',
    phone: '+977-9847411305',
    email: 'event.eleveneleven@gmail.com',
    address: 'Jawalakhel, Lalitpur, Nepal',
    website: 'https://decorationnepal.com',
    facebook: 'https://facebook.com/11byNK',
    instagram: 'https://instagram.com/11byNK',
    whatsapp: '9779847411305',
    ...brandingDefaults,
    primaryColor: '#f2ca50',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    taxRate: '13',
    defaultAdvancePercent: '50',
    quotationValidityDays: '30',
    businessHours: 'Sun-Fri 9AM-6PM',
    allowOnlineBooking: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [isLoadingBranding, setIsLoadingBranding] = useState(true);
  const [saveError, setSaveError] = useState('');
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load branding settings');
        }
        setSettings((current) => ({ ...current, ...result.branding }));
        if (Array.isArray(result.heroSlides)) setHeroSlides(result.heroSlides);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Failed to load branding settings');
      } finally {
        setIsLoadingBranding(false);
      }
    };

    void loadBranding();
  }, []);

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setSaveError('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo: settings.logo,
          favicon: settings.favicon,
          ogImage: settings.ogImage,
          logoSizePercent: settings.logoSizePercent,
          heroSlides,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to save settings');
      }
      setSettings((current) => ({ ...current, ...result.branding }));
      if (Array.isArray(result.heroSlides)) setHeroSlides(result.heroSlides);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-on-surface-variant mt-1">Manage your business and application settings.</p>
        </div>
        <button disabled={isLoadingBranding} onClick={handleSave} className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded cursor-pointer hover:bg-primary-fixed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 active:translate-y-0 active:scale-[0.98] transition-all duration-200 font-semibold text-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100">
          <Save className="w-4 h-4" />
          <span>{saved ? '✓ Saved' : 'Save Settings'}</span>
        </button>
      </div>
      {saveError && (
        <p className="mb-6 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          {saveError}
        </p>
      )}

      <div className="mb-6 bg-surface-container border border-outline-variant rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-cream-contrast">Homepage Hero Slider</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Create rotating hero slides with editable images, labels, headings, and descriptions.</p>
        </div>
        {heroSlides.map((slide, index) => (
          <div key={slide.id} className="rounded-xl border border-outline-variant/70 bg-surface-container-low p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-cream-contrast">Slide {index + 1}</h3>
              {heroSlides.length > 1 && (
                <button type="button" onClick={() => setHeroSlides(heroSlides.filter((item) => item.id !== slide.id))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove slide</button>
              )}
            </div>
            <DragDropImage className="max-w-xl" value={slide.image} onChange={(image) => setHeroSlides(heroSlides.map((item) => item.id === slide.id ? { ...item, image } : item))} uploadFolder="branding" aspectRatio="wide" placeholder="Upload hero image" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {([
                ['eyebrow', 'Small label'],
                ['heading', 'Main heading'],
                ['highlight', 'Highlighted heading'],
                ['description', 'Description'],
              ] as const).map(([key, label]) => (
                <div key={key} className={key === 'description' ? 'md:col-span-2' : ''}>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">{label}</label>
                  {key === 'description' ? (
                    <textarea value={slide[key]} onChange={(event) => setHeroSlides(heroSlides.map((item) => item.id === slide.id ? { ...item, [key]: event.target.value } : item))} rows={3} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
                  ) : (
                    <input value={slide[key]} onChange={(event) => setHeroSlides(heroSlides.map((item) => item.id === slide.id ? { ...item, [key]: event.target.value } : item))} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setHeroSlides([...heroSlides, { ...defaultHeroSlides[0], id: `hero-${Date.now()}`, image: '' }])} className="rounded-lg border border-primary/50 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">+ Add slide</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" /> Business Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Company Name</label>
              <input value={settings.companyName} onChange={(e) => updateSetting('companyName', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Address</label>
              <input value={settings.address} onChange={(e) => updateSetting('address', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Business Hours</label>
              <input value={settings.businessHours} onChange={(e) => updateSetting('businessHours', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" /> Contact Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Phone</label>
              <input value={settings.phone} onChange={(e) => updateSetting('phone', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Email</label>
              <input value={settings.email} onChange={(e) => updateSetting('email', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">WhatsApp Number</label>
              <input value={settings.whatsapp} onChange={(e) => updateSetting('whatsapp', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Social & Web
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Website</label>
              <input value={settings.website} onChange={(e) => updateSetting('website', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Facebook URL</label>
              <input value={settings.facebook} onChange={(e) => updateSetting('facebook', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Instagram URL</label>
              <input value={settings.instagram} onChange={(e) => updateSetting('instagram', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <ImageIcon aria-hidden="true" className="w-5 h-5 text-primary" /> Branding
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Logo</label>
              <DragDropImage
                className="max-w-xs"
                value={settings.logo}
                onChange={(url) => updateSetting('logo', url)}
                uploadFolder="branding"
                aspectRatio="wide"
                placeholder="Upload your primary logo"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Social share image</label>
              <DragDropImage
                value={settings.ogImage}
                onChange={(url) => updateSetting('ogImage', url)}
                uploadFolder="branding"
                aspectRatio="wide"
                placeholder="Upload the Open Graph image"
              />
              <p className="mt-1 text-xs text-on-surface-variant">Recommended size: 1200 × 630px.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Favicon</label>
              <DragDropImage
                value={settings.favicon}
                onChange={(url) => updateSetting('favicon', url)}
                uploadFolder="branding"
                aspectRatio="square"
                placeholder="Upload your favicon"
              />
              <p className="mt-1 text-xs text-on-surface-variant">Use a square PNG or ICO file, ideally 256 × 256px.</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="logo-size" className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Logo size</label>
                <span className="text-sm font-semibold text-primary">{settings.logoSizePercent}%</span>
              </div>
              <input
                id="logo-size"
                type="range"
                min="50"
                max="200"
                step="5"
                value={settings.logoSizePercent}
                onChange={(e) => updateSetting('logoSizePercent', Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-on-surface-variant">
                <span>50%</span>
                <span>Default 100%</span>
                <span>200%</span>
              </div>
              <p className="mt-2 text-xs text-on-surface-variant">Controls the displayed logo size across the public site and admin panel.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Primary Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.primaryColor} onChange={(e) => updateSetting('primaryColor', e.target.value)} className="w-10 h-10 rounded border border-outline cursor-pointer" />
                <input value={settings.primaryColor} onChange={(e) => updateSetting('primaryColor', e.target.value)} className="flex-1 bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* Business Rules */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Business Rules
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Currency</label>
                <select value={settings.currency} onChange={(e) => updateSetting('currency', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition">
                  <option value="NPR">NPR (Nepali Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Tax Rate (%)</label>
                <input type="number" value={settings.taxRate} onChange={(e) => updateSetting('taxRate', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Default Advance (%)</label>
                <input type="number" value={settings.defaultAdvancePercent} onChange={(e) => updateSetting('defaultAdvancePercent', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Quote Validity (days)</label>
                <input type="number" value={settings.quotationValidityDays} onChange={(e) => updateSetting('quotationValidityDays', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Timezone</label>
              <select value={settings.timezone} onChange={(e) => updateSetting('timezone', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition">
                <option value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-cream-contrast flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.allowOnlineBooking} onChange={(e) => updateSetting('allowOnlineBooking', e.target.checked)} className="w-5 h-5 rounded accent-primary" />
              <div>
                <p className="text-sm font-semibold text-cream-contrast">Allow Online Booking</p>
                <p className="text-xs text-on-surface-variant">Customers can submit event requests via the planner</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => updateSetting('emailNotifications', e.target.checked)} className="w-5 h-5 rounded accent-primary" />
              <div>
                <p className="text-sm font-semibold text-cream-contrast">Email Notifications</p>
                <p className="text-xs text-on-surface-variant">Get notified about new leads and bookings</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.smsNotifications} onChange={(e) => updateSetting('smsNotifications', e.target.checked)} className="w-5 h-5 rounded accent-primary" />
              <div>
                <p className="text-sm font-semibold text-cream-contrast">SMS Notifications</p>
                <p className="text-xs text-on-surface-variant">Receive SMS alerts for urgent updates</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
