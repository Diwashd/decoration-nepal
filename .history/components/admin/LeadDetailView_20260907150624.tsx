'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  User,
  Clock,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface Lead {
  id: string;
  customerId: string | null;
  source: string;
  eventTypeId: string;
  eventDate: string;
  budgetRange: string | null;
  venue: string | null;
  assignedSalespersonId: string | null;
  status: string;
  lastContactDate: Date | null;
  nextFollowUpDate: Date | null;
  notes: string | null;
  specialRequests: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string | null;
  } | null;
  eventType?: {
    id: string;
    name: string;
  } | null;
  assignedSalesperson?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface SalesUser {
  id: string;
  name: string;
  email: string;
}

interface LeadDetailViewProps {
  lead: Lead;
  salesUsers: SalesUser[];
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-primary-container/20 text-primary border-primary-container/30' },
  { value: 'contacted', label: 'Contacted', color: 'bg-muted-gold/20 text-champagne-gold border-muted-gold/30' },
  { value: 'quoted', label: 'Quoted', color: 'bg-primary/20 text-primary border-primary/30' },
  { value: 'won', label: 'Won', color: 'bg-primary-container/20 text-primary-container border-primary-container/30' },
  { value: 'lost', label: 'Lost', color: 'bg-surface-container-high text-on-surface-variant border-outline-variant' },
];

export default function LeadDetailView({ lead, salesUsers }: LeadDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const preferredDates = lead.notes?.match(/^Preferred Dates: (.+)$/m)?.[1] || lead.eventDate;

  const [formData, setFormData] = useState({
    status: lead.status,
    assignedSalespersonId: lead.assignedSalespersonId || '',
    notes: lead.notes || '',
    nextFollowUpDate: lead.nextFollowUpDate
      ? new Date(lead.nextFollowUpDate).toISOString().split('T')[0]
      : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/leads/${lead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            assignedSalespersonId: formData.assignedSalespersonId || null,
            nextFollowUpDate: formData.nextFollowUpDate || null,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess('Lead updated successfully!');
          router.refresh();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(result.error || 'Failed to update lead');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    });
  };

  const getStatusColor = (status: string) => {
    return STATUS_OPTIONS.find((s) => s.value === status)?.color || 'bg-surface-container-high text-on-surface-variant border-outline-variant';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/leads" className="p-2 hover:bg-surface-container-high rounded transition">
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">Lead Details</h1>
            <p className="text-on-surface-variant mt-1">
              {lead.eventType?.name} Event • {lead.customer?.name}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold"
        >
          <Save className="w-5 h-5" />
          <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-surface-container-high border border-primary/30 text-primary px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Name</label>
                <div className="text-on-surface font-medium">{lead.customer?.name}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Email</label>
                <div className="flex items-center text-on-surface">
                  <Mail className="w-4 h-4 mr-2 text-on-surface-variant" />
                  <a href={`mailto:${lead.customer?.email}`} className="text-primary hover:underline">
                    {lead.customer?.email}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Phone</label>
                <div className="flex items-center text-on-surface">
                  <Phone className="w-4 h-4 mr-2 text-on-surface-variant" />
                  <a href={`tel:${lead.customer?.phone}`} className="text-primary hover:underline">
                    {lead.customer?.phone}
                  </a>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Address</label>
                <div className="text-on-surface">{lead.customer?.address || 'Not provided'}</div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Event Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Event Type</label>
                <div className="text-on-surface font-medium">{lead.eventType?.name}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Preferred Dates</label>
                <div className="flex items-center text-on-surface">
                  <Calendar className="w-4 h-4 mr-2 text-on-surface-variant" />
                  <span className="break-words">{preferredDates}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Venue</label>
                <div className="flex items-center text-on-surface">
                  <MapPin className="w-4 h-4 mr-2 text-on-surface-variant" />
                  {lead.venue || 'Not specified'}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-on-surface-variant">Budget Range</label>
                <div className="flex items-center text-on-surface">
                  <DollarSign className="w-4 h-4 mr-2 text-on-surface-variant" />
                  {lead.budgetRange || 'Not specified'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-on-surface-variant">Special Requests</label>
                <div className="text-on-surface mt-1">
                  {lead.specialRequests || <span className="text-on-surface-variant italic">No special requests</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Lead Management */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Lead Management
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"
                    required
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Assign To</label>
                  <select
                    value={formData.assignedSalespersonId}
                    onChange={(e) => setFormData({ ...formData, assignedSalespersonId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"
                  >
                    <option value="">Unassigned</option>
                    {salesUsers.map((user) => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Next Follow-Up Date</label>
                <input
                  type="date"
                  value={formData.nextFollowUpDate}
                  onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Internal Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition"
                  rows={6}
                  placeholder="Add notes about conversations, requirements, follow-ups..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Lead Status</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-on-surface-variant">Current Status:</span>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-2 rounded text-sm font-semibold border ${getStatusColor(lead.status)}`}>
                    {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label || lead.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant">Source:</span>
                <div className="font-medium text-on-surface mt-1 capitalize">{lead.source}</div>
              </div>
              <div>
                <span className="text-sm text-on-surface-variant">Lead ID:</span>
                <div className="font-mono text-xs text-on-surface mt-1 break-all">{lead.id}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-on-surface-variant" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <div className="text-sm font-semibold text-on-surface">Lead Created</div>
                  <div className="text-xs text-on-surface-variant">
                    {new Date(lead.createdAt).toLocaleString('en-NP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              {lead.lastContactDate && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-semibold text-on-surface">Last Contact</div>
                    <div className="text-xs text-on-surface-variant">
                      {new Date(lead.lastContactDate).toLocaleString('en-NP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface-container-high border border-primary/20 rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded border border-outline-variant transition font-semibold text-sm"
                onClick={() => { if (lead.customer?.email) window.location.href = `mailto:${lead.customer.email}`; }}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Send Email
              </button>
              <button
                type="button"
                className="w-full bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded border border-outline-variant transition font-semibold text-sm"
                onClick={() => { if (lead.customer?.phone) window.location.href = `tel:${lead.customer.phone}`; }}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Call Customer
              </button>
              <Link
                href={`/admin/quotations/new?leadId=${lead.id}`}
                className="w-full bg-primary hover:bg-primary-container text-surface px-4 py-2.5 rounded transition font-semibold text-sm flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Create Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
