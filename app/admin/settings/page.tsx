'use client';

import { useState } from 'react';
import { Settings, Save, Building, Phone, Mail, Globe, Image, Shield, Bell } from 'lucide-react';

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
    logo: '/logo.png',
    favicon: '/favicon.ico',
    ogImage: '/og-image.jpg',
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

  const updateSetting = (key: string, value: string | boolean | number) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <button onClick={handleSave} className="flex items-center space-x-2 bg-primary text-on-primary px-6 py-2.5 rounded hover:bg-primary-fixed transition font-semibold text-sm">
          <Save className="w-4 h-4" />
          <span>{saved ? '✓ Saved' : 'Save Settings'}</span>
        </button>
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
            <Image className="w-5 h-5 text-primary" /> Branding
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">Logo URL</label>
              <input value={settings.logo} onChange={(e) => updateSetting('logo', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 block">OG Image URL</label>
              <input value={settings.ogImage} onChange={(e) => updateSetting('ogImage', e.target.value)} className="w-full bg-surface-container-high text-cream-contrast py-2.5 px-4 border-b border-outline focus:border-primary focus:outline-none text-sm transition" />
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
