'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Calendar, MapPin, Users, Clock, User, Palette } from 'lucide-react';
import Link from 'next/link';

interface NewEventFormProps {
  user: any;
  quotation: any;
  coordinators: any[];
  themes: any[];
  colorPalettes: any[];
}

export default function NewEventForm({ user, quotation, coordinators, themes, colorPalettes }: NewEventFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: quotation?.lead?.customer?.name ? `${quotation.lead.eventType.name} - ${quotation.lead.customer.name}` : '',
    eventDate: quotation?.lead?.eventDate || '',
    startTime: '',
    endTime: '',
    venue: quotation?.lead?.venue || '',
    venueAddress: '',
    guestCount: '',
    coordinatorId: '',
    themeId: '',
    colorPaletteId: '',
    specialInstructions: quotation?.lead?.specialRequests || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!quotation) { setError('Quotation is required to create an event'); return; }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quotationId: quotation.id, leadId: quotation.leadId, customerId: quotation.customerId, eventTypeId: quotation.lead.eventTypeId, ...formData, guestCount: formData.guestCount ? parseInt(formData.guestCount) : null }),
        });
        const result = await response.json();
        if (result.success) {
          setSuccess('Event created successfully!');
          setTimeout(() => { router.push(`/admin/events/${result.event.id}`); router.refresh(); }, 1500);
        } else { setError(result.error || 'Failed to create event'); }
      } catch (err) { setError('Something went wrong. Please try again.'); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/events" className="p-2 hover:bg-surface-container-high rounded transition"><ArrowLeft className="w-5 h-5 text-on-surface-variant" /></Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">Create Event</h1>
            <p className="text-on-surface-variant mt-1">{quotation ? `From Quotation ${quotation.quotationNumber}` : 'New event setup'}</p>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold">
          <Save className="w-5 h-5" /><span>{isPending ? 'Creating...' : 'Create Event'}</span>
        </button>
      </div>

      {error && <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4">Event Information</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Event Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-on-surface-variant mb-2"><Calendar className="w-4 h-4 inline mr-1" />Event Date *</label><input type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required /></div>
                <div><label className="block text-sm font-semibold text-on-surface-variant mb-2"><Users className="w-4 h-4 inline mr-1" />Guest Count</label><input type="number" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" min="1" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold text-on-surface-variant mb-2"><Clock className="w-4 h-4 inline mr-1" />Start Time</label><input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" /></div>
                <div><label className="block text-sm font-semibold text-on-surface-variant mb-2"><Clock className="w-4 h-4 inline mr-1" />End Time</label><input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" /></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4"><MapPin className="w-5 h-5 inline mr-2 text-primary" />Venue Details</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Venue Name *</label><input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" required /></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Venue Address</label><textarea value={formData.venueAddress} onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={3} placeholder="Full venue address..." /></div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4"><Palette className="w-5 h-5 inline mr-2 text-primary" />Theme & Style</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Theme</label><select value={formData.themeId} onChange={(e) => setFormData({ ...formData, themeId: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"><option value="">Select theme</option>{themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-on-surface-variant mb-2">Color Palette</label><select value={formData.colorPaletteId} onChange={(e) => setFormData({ ...formData, colorPaletteId: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"><option value="">Select color palette</option>{colorPalettes.map((palette) => <option key={palette.id} value={palette.id}>{palette.name}</option>)}</select></div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4">Special Instructions</h2>
            <textarea value={formData.specialInstructions} onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" rows={4} placeholder="Any special requirements, setup notes, or customer requests..." />
          </div>
        </div>

        <div className="space-y-6">
          {quotation && (
            <div className="bg-surface-container-high border border-primary/20 rounded p-6">
              <h3 className="font-bold text-cream-contrast mb-4">From Quotation</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-on-surface-variant">Quotation #:</span><div className="font-mono font-semibold text-primary">{quotation.quotationNumber}</div></div>
                <div><span className="text-on-surface-variant">Customer:</span><div className="font-semibold text-on-surface">{quotation.customer.name}</div></div>
                <div><span className="text-on-surface-variant">Event Type:</span><div className="font-semibold text-on-surface">{quotation.lead.eventType.name}</div></div>
                <div><span className="text-on-surface-variant">Amount:</span><div className="font-bold text-lg text-primary">Rs. {quotation.totalAmount.toLocaleString()}</div></div>
              </div>
            </div>
          )}

          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4"><User className="w-5 h-5 inline mr-2 text-on-surface-variant" />Event Coordinator</h3>
            <select value={formData.coordinatorId} onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition">
              <option value="">Assign later</option>
              {coordinators.map((coord) => <option key={coord.id} value={coord.id}>{coord.name}</option>)}
            </select>
            <p className="text-xs text-on-surface-variant mt-2">Coordinator will manage event execution and team</p>
          </div>

          <div className="bg-surface-container-high border border-outline-variant rounded p-4">
            <h4 className="font-semibold text-cream-contrast mb-2">After Creating:</h4>
            <ul className="text-sm text-on-surface-variant space-y-1">
              <li>• Assign staff members</li>
              <li>• Reserve inventory items</li>
              <li>• Create task checklists</li>
              <li>• Track event progress</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
