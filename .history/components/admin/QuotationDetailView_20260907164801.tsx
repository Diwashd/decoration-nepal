'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Send,
  Download,
  CheckCircle,
  XCircle,
  Edit,
  Calendar,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, getQuotationWhatsAppLink } from '@/lib/utils';

interface QuotationDetailViewProps {
  quotation: any;
  user: any;
}

export default function QuotationDetailView({ quotation, user }: QuotationDetailViewProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Are you sure you want to mark this quotation as ${newStatus}?`)) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/quotations/${quotation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (result.success) router.refresh();
      else alert('Failed to update status');
    } catch (error) {
      alert('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = () => alert('PDF generation coming soon!');

  const handleSendEmail = () => {
    const subject = `Quotation ${quotation.quotationNumber} from 11:11 Decoration Nepal`;
    const body = `Dear ${quotation.customer.name},\n\nPlease find attached your quotation for ${quotation.lead.eventType.name}.\n\nBest regards,\n11:11 Decoration Nepal`;
    window.location.href = `mailto:${quotation.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppStatus = async (sent: boolean) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/quotations/${quotation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappSent: sent }),
      });
      const result = await response.json();
      if (result.success) router.refresh();
      else alert(result.error || 'Failed to update WhatsApp status');
    } catch {
      alert('Something went wrong while updating WhatsApp status');
    } finally {
      setIsUpdating(false);
    }
  };

  const whatsappLink = getQuotationWhatsAppLink(quotation.customer.phone, {
    quotationNumber: quotation.quotationNumber,
    customerName: quotation.customer.name,
    eventType: quotation.lead.eventType.name,
    validUntil: quotation.validUntil,
    items: quotation.items || [],
    subtotal: quotation.subtotal,
    discountAmount: quotation.discountAmount,
    transportationCost: quotation.transportationCost,
    taxAmount: quotation.taxAmount,
    totalAmount: quotation.totalAmount,
    advanceRequired: quotation.advanceRequired,
    termsAndConditions: quotation.termsAndConditions,
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
      sent: 'bg-primary-container/20 text-primary border-primary-container/30',
      accepted: 'bg-primary/20 text-primary border-primary/30',
      rejected: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
    };
    return styles[status] || 'bg-surface-container-high text-on-surface-variant border-outline-variant';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotations" className="p-2 hover:bg-surface-container-high rounded transition">
            <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold font-display text-cream-contrast">Quotation {quotation.quotationNumber}</h1>
            <p className="text-on-surface-variant mt-1">{quotation.customer.name} • {quotation.lead.eventType.name}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {quotation.status === 'draft' && (
            <button onClick={() => handleStatusUpdate('sent')} disabled={isUpdating} className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold">
              <Send className="w-5 h-5" />
              <span>Send to Customer</span>
            </button>
          )}
          {quotation.status === 'sent' && (
            <>
              <button onClick={() => handleStatusUpdate('accepted')} disabled={isUpdating} className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container disabled:opacity-50 transition font-semibold">
                <CheckCircle className="w-5 h-5" />
                <span>Mark Accepted</span>
              </button>
              <button onClick={() => handleStatusUpdate('rejected')} disabled={isUpdating} className="flex items-center space-x-2 bg-surface-container-high text-on-surface px-6 py-2.5 rounded border border-outline-variant hover:border-primary transition font-semibold">
                <XCircle className="w-5 h-5" />
                <span>Mark Rejected</span>
              </button>
            </>
          )}
          <button onClick={handleDownloadPDF} className="flex items-center space-x-2 border border-outline-variant text-on-surface px-6 py-2.5 rounded hover:bg-surface-container-high transition font-semibold">
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Event Info */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-cream-contrast mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center"><User className="w-4 h-4 mr-2 text-on-surface-variant" /><span className="font-semibold text-on-surface">{quotation.customer.name}</span></div>
                  <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-on-surface-variant" /><a href={`mailto:${quotation.customer.email}`} className="text-primary hover:underline">{quotation.customer.email}</a></div>
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-on-surface-variant" /><a href={`tel:${quotation.customer.phone}`} className="text-primary hover:underline">{quotation.customer.phone}</a></div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-cream-contrast mb-3">Event Details</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-on-surface-variant">Event Type:</span><div className="font-semibold text-on-surface">{quotation.lead.eventType.name}</div></div>
                  <div><span className="text-on-surface-variant">Valid Until:</span><div className="font-semibold text-on-surface">{quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No expiry'}</div></div>
                  <div><span className="text-on-surface-variant">Created By:</span><div className="font-semibold text-on-surface">{quotation.createdBy?.name || 'Unknown'}</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
            <div className="p-6 border-b border-outline-variant">
              <h3 className="font-bold text-cream-contrast">Quotation Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">Item</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-on-surface-variant uppercase">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-on-surface-variant uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-on-surface-variant uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {quotation.items?.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-cream-contrast">{item.name}</div>
                        {item.description && <div className="text-sm text-on-surface-variant mt-1">{item.description}</div>}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-on-surface">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm text-on-surface">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-cream-contrast">{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-6 bg-surface-container-low border-t border-outline-variant">
              <div className="max-w-xs ml-auto space-y-2">
                <div className="flex items-center justify-between text-sm"><span className="text-on-surface-variant">Subtotal:</span><span className="font-semibold text-on-surface">{formatCurrency(quotation.subtotal)}</span></div>
                {quotation.discountAmount > 0 && <div className="flex items-center justify-between text-sm text-primary"><span>Discount:</span><span className="font-semibold">-{formatCurrency(quotation.discountAmount)}</span></div>}
                {quotation.transportationCost > 0 && <div className="flex items-center justify-between text-sm"><span className="text-on-surface-variant">Transportation:</span><span className="font-semibold text-on-surface">{formatCurrency(quotation.transportationCost)}</span></div>}
                {quotation.taxAmount > 0 && <div className="flex items-center justify-between text-sm"><span className="text-on-surface-variant">Tax:</span><span className="font-semibold text-on-surface">{formatCurrency(quotation.taxAmount)}</span></div>}
                <div className="flex items-center justify-between text-lg font-bold border-t border-outline-variant pt-2"><span className="text-on-surface">Grand Total:</span><span className="text-primary">{formatCurrency(quotation.totalAmount)}</span></div>
                {quotation.advanceRequired > 0 && (
                  <div className="flex items-center justify-between text-sm bg-surface-container-high border border-primary/30 rounded px-3 py-2 mt-3">
                    <span className="text-primary font-semibold">Advance Required:</span>
                    <span className="text-primary font-bold">{formatCurrency(quotation.advanceRequired)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms */}
          {quotation.termsAndConditions && (
            <div className="bg-surface-container border border-outline-variant rounded p-6">
              <h3 className="font-bold text-cream-contrast mb-3">Terms & Conditions</h3>
              <div className="text-sm text-on-surface whitespace-pre-line">{quotation.termsAndConditions}</div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Status</h3>
            <div className="space-y-3">
              <div><span className="text-sm text-on-surface-variant">Current Status:</span><div className="mt-2"><span className={`inline-flex items-center px-3 py-2 rounded text-sm font-semibold border ${getStatusBadge(quotation.status)}`}>{quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}</span></div></div>
              <div><span className="text-sm text-on-surface-variant">Version:</span><div className="font-medium text-on-surface mt-1">v{quotation.version}</div></div>
              <div><span className="text-sm text-on-surface-variant">Created:</span><div className="font-medium text-on-surface mt-1">{new Date(quotation.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}</div></div>
              <div className="border-t border-outline-variant pt-3">
                <span className="text-sm text-on-surface-variant">WhatsApp quotation:</span>
                <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-on-surface cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotation.whatsappSent === true}
                    onChange={(event) => handleWhatsAppStatus(event.target.checked)}
                    disabled={isUpdating}
                    className="h-4 w-4 accent-primary cursor-pointer"
                  />
                  {quotation.whatsappSent ? 'Marked as sent' : 'Not sent yet'}
                </label>
                {quotation.whatsappSentAt && (
                  <div className="text-xs text-on-surface-variant mt-1">
                    {new Date(quotation.whatsappSentAt).toLocaleString('en-NP')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-high border border-primary/20 rounded p-6">
            <h3 className="font-bold text-cream-contrast mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={handleSendEmail} className="w-full bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded border border-outline-variant transition font-semibold text-sm flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" /><span>Email Customer</span>
              </button>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-4 py-2.5 rounded border border-[#25D366]/40 transition font-semibold text-sm flex items-center justify-center space-x-2 cursor-pointer">
                <Phone className="w-4 h-4" /><span>Send via WhatsApp</span>
              </a>
              <Link href={`/admin/leads/${quotation.leadId}`} className="w-full bg-surface hover:bg-surface-container-high text-on-surface px-4 py-2.5 rounded border border-outline-variant transition font-semibold text-sm flex items-center justify-center space-x-2">
                <Edit className="w-4 h-4" /><span>View Lead</span>
              </Link>
              {quotation.status === 'accepted' && (
                <Link href={`/admin/events/new?quotationId=${quotation.id}`} className="w-full bg-primary hover:bg-primary-container text-surface px-4 py-2.5 rounded transition font-semibold text-sm flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" /><span>Create Event</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
