'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Send,
  Calculator,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Lead {
  id: string;
  eventDate: string;
  venue: string | null;
  budgetRange: string | null;
  specialRequests: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  eventType: {
    id: string;
    name: string;
  } | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
}

interface PackageItem {
  id: string;
  name: string;
  basePrice: number;
  eventType: {
    id: string;
    name: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface QuotationItem {
  id: string;
  serviceId?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  isCustom: boolean;
}

interface NewQuotationFormProps {
  user: User;
  lead: Lead | null;
  services: Service[];
  packages: PackageItem[];
}

export default function NewQuotationForm({
  user,
  lead,
  services,
  packages,
}: NewQuotationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    leadId: lead?.id || '',
    customerId: lead?.customer?.id || '',
    customerName: lead?.customer?.name || '',
    customerEmail: lead?.customer?.email || '',
    customerPhone: lead?.customer?.phone || '',
    validityDays: '30',
    discountAmount: '0',
    transportationCost: '0',
    taxPercent: '0',
    advancePercent: '50',
    termsAndConditions: `1. 50% advance payment required to confirm booking
2. Balance payment due 3 days before the event
3. Cancellation charges apply as per our policy
4. Setup time: 4-6 hours before event
5. Teardown: Within 2 hours after event conclusion
6. Any damage to rented items will be charged at replacement cost`,
  });

  const [items, setItems] = useState<QuotationItem[]>([]);

  // Add item from service
  const addServiceItem = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;

    const newItem: QuotationItem = {
      id: `temp-${Date.now()}`,
      serviceId: service.id,
      name: service.name,
      description: service.description || '',
      quantity: 1,
      unit: 'item',
      unitPrice: service.basePrice,
      totalPrice: service.basePrice,
      isCustom: false,
    };

    setItems([...items, newItem]);
  };

  // Add package as multiple items
  const addPackageItems = (packageId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return;

    const newItem: QuotationItem = {
      id: `temp-${Date.now()}`,
      name: `${pkg.name} Package`,
      description: 'Complete package with all included services',
      quantity: 1,
      unit: 'package',
      unitPrice: pkg.basePrice,
      totalPrice: pkg.basePrice,
      isCustom: false,
    };

    setItems([...items, newItem]);
  };

  // Add custom item
  const addCustomItem = () => {
    const newItem: QuotationItem = {
      id: `temp-${Date.now()}`,
      name: '',
      description: '',
      quantity: 1,
      unit: 'item',
      unitPrice: 0,
      totalPrice: 0,
      isCustom: true,
    };

    setItems([...items, newItem]);
  };

  // Update item
  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }

        return updated;
      })
    );
  };

  // Remove item
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = parseFloat(formData.discountAmount) || 0;
  const transportationCost = parseFloat(formData.transportationCost) || 0;
  const taxPercent = parseFloat(formData.taxPercent) || 0;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxPercent) / 100;
  const grandTotal = afterDiscount + transportationCost + taxAmount;
  const advancePercent = parseFloat(formData.advancePercent) || 0;
  const advanceRequired = (grandTotal * advancePercent) / 100;

  const handleSubmit = async (status: 'draft' | 'sent') => {
    setError(null);
    setSuccess(null);

    if (!formData.leadId || !formData.customerId) {
      setError('Lead and customer information required');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one item to the quotation');
      return;
    }

    // Validate custom items have names and prices
    const invalidItems = items.filter(
      (item) => item.isCustom && (!item.name || item.unitPrice <= 0)
    );
    if (invalidItems.length > 0) {
      setError('Please fill in all custom item details');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/quotations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: formData.leadId,
            customerId: formData.customerId,
            validityDays: parseInt(formData.validityDays),
            subtotal,
            discountAmount,
            transportationCost,
            taxAmount,
            grandTotal,
            advanceRequired,
            termsAndConditions: formData.termsAndConditions,
            status,
            items: items.map((item) => ({
              serviceId: item.serviceId,
              name: item.name,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              isCustom: item.isCustom,
            })),
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSuccess(
            status === 'draft'
              ? 'Quotation saved as draft.'
              : 'Quotation created and marked as sent. Email delivery is not configured yet.'
          );
          setTimeout(() => {
            router.push(`/admin/quotations/${result.quotation.id}`);
            router.refresh();
          }, 1500);
        } else {
          setError(result.error || 'Failed to create quotation');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    });
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
            <h1 className="text-3xl font-bold text-cream-contrast font-display">Create Quotation</h1>
            <p className="text-on-surface-variant mt-1">
              {lead ? `For ${lead.customer?.name || 'Unknown'} - ${lead.eventType?.name || 'Unknown'}` : 'New quotation'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className="flex items-center space-x-2 border border-outline text-on-surface-variant px-6 py-2.5 rounded-sm hover:bg-surface-container-high disabled:opacity-50 transition font-semibold text-sm"
          >
            <Save className="w-5 h-5" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('sent')}
            disabled={isPending}
            className="flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded-sm hover:bg-primary/90 disabled:opacity-50 transition font-semibold text-sm tracking-wide"
          >
            <Send className="w-5 h-5" />
            <span>{isPending ? 'Creating...' : 'Create & Send'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary/10 border border-primary/30 text-primary px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          {lead && (
            <div className="bg-surface-container border border-outline-variant rounded p-6">
              <h2 className="text-lg font-bold text-cream-contrast mb-4 font-display">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-on-surface-variant">Name:</span>
                  <div className="font-semibold text-cream-contrast">{lead.customer?.name || 'Unknown'}</div>
                </div>
                <div>
                  <span className="text-on-surface-variant">Email:</span>
                  <div className="font-semibold text-cream-contrast">{lead.customer?.email || 'Unknown'}</div>
                </div>
                <div>
                  <span className="text-on-surface-variant">Phone:</span>
                  <div className="font-semibold text-cream-contrast">{lead.customer?.phone || 'Unknown'}</div>
                </div>
                <div>
                  <span className="text-on-surface-variant">Event Type:</span>
                  <div className="font-semibold text-cream-contrast">{lead.eventType?.name || 'Unknown'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Add Items */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 font-display">Add Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addServiceItem(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-4 py-2.5 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast focus:outline-none transition"
              >
                <option value="">+ Add Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatCurrency(service.basePrice)}
                  </option>
                ))}
              </select>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addPackageItems(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-4 py-2.5 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast focus:outline-none transition"
              >
                <option value="">+ Add Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {formatCurrency(pkg.basePrice)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addCustomItem}
                className="flex items-center justify-center space-x-2 border border-dashed border-outline text-on-surface-variant px-4 py-2.5 rounded-sm hover:border-primary hover:text-primary transition font-semibold text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>Custom Item</span>
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 font-display">Quotation Items</h2>
            {items.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <Package className="w-12 h-12 mx-auto mb-3 text-outline" />
                <p>No items added yet. Add services, packages, or custom items above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border border-outline-variant rounded p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-sm font-semibold text-on-surface-variant">#{index + 1}</div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item name"
                          className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast font-semibold focus:outline-none transition"
                          disabled={!item.isCustom}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-on-surface-variant text-sm focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)
                          }
                          placeholder="Qty"
                          min="1"
                          step="1"
                          className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          placeholder="Unit Price"
                          min="0"
                          step="100"
                          className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
                      <span className="text-sm text-on-surface-variant">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                      <span className="text-lg font-bold text-cream-contrast">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="bg-surface-container border border-outline-variant rounded p-6">
            <h2 className="text-lg font-bold text-cream-contrast mb-4 font-display">Terms & Conditions</h2>
            <textarea
              value={formData.termsAndConditions}
              onChange={(e) =>
                setFormData({ ...formData, termsAndConditions: e.target.value })
              }
              className="w-full px-4 py-3 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast focus:outline-none transition"
              rows={8}
              placeholder="Enter terms and conditions..."
            />
          </div>
        </div>

        {/* Sidebar - Calculations */}
        <div className="space-y-6">
          <div className="bg-surface-container border border-outline-variant rounded p-6 sticky top-6">
            <h3 className="font-bold text-cream-contrast mb-4 flex items-center font-display">
              <Calculator className="w-5 h-5 mr-2 text-primary" />
              Summary
            </h3>

            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-semibold text-cream-contrast">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount */}
              <div>
                <label className="text-sm text-on-surface-variant mb-1 block">Discount</label>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, discountAmount: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast text-sm focus:outline-none transition"
                  min="0"
                  step="100"
                />
              </div>

              {/* Transportation */}
              <div>
                <label className="text-sm text-on-surface-variant mb-1 block">Transportation</label>
                <input
                  type="number"
                  value={formData.transportationCost}
                  onChange={(e) =>
                    setFormData({ ...formData, transportationCost: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast text-sm focus:outline-none transition"
                  min="0"
                  step="100"
                />
              </div>

              {/* Tax */}
              <div>
                <label className="text-sm text-on-surface-variant mb-1 block">Tax (%)</label>
                <input
                  type="number"
                  value={formData.taxPercent}
                  onChange={(e) => setFormData({ ...formData, taxPercent: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast text-sm focus:outline-none transition"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <div className="text-xs text-on-surface-variant mt-1">
                  Tax Amount: {formatCurrency(taxAmount)}
                </div>
              </div>

              <div className="border-t border-outline-variant pt-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-cream-contrast">Grand Total</span>
                  <span className="text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Advance */}
              <div>
                <label className="text-sm text-on-surface-variant mb-1 block">Advance (%)</label>
                <input
                  type="number"
                  value={formData.advancePercent}
                  onChange={(e) =>
                    setFormData({ ...formData, advancePercent: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast text-sm focus:outline-none transition"
                  min="0"
                  max="100"
                  step="5"
                />
                <div className="text-sm font-semibold text-primary mt-2">
                  Advance Required: {formatCurrency(advanceRequired)}
                </div>
              </div>

              {/* Validity */}
              <div>
                <label className="text-sm text-on-surface-variant mb-1 block">Valid for (days)</label>
                <input
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-container-high border border-outline rounded-sm focus:border-primary text-cream-contrast text-sm focus:outline-none transition"
                  min="1"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
