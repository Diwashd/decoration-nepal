'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Search, Download, CreditCard, CheckCircle, Clock, Plus, Edit3, Trash2, X, Calendar, AlertCircle } from 'lucide-react';

type Installment = {
  id: string;
  eventId: string;
  installmentType: string;
  installmentNumber: number;
  amount: number;
  dueDate: string | null;
  paymentDate: string | null;
  paymentMethod: string | null;
  transactionReference: string | null;
  status: string;
  notes: string | null;
  eventName: string | null;
  customerName: string | null;
  quotationNumber: string | null;
  createdAt: string;
};

export default function AdminPaymentInstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'advance' | 'installment' | 'final'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    eventId: '',
    installmentType: 'installment',
    installmentNumber: 1,
    amount: '',
    dueDate: '',
    paymentDate: '',
    paymentMethod: '',
    transactionReference: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fetchInstallments();
  }, []);

  const fetchInstallments = async () => {
    try {
      const response = await fetch('/api/admin/payment-installments');
      const result = await response.json();
      if (response.ok && result.success) {
        setInstallments(result.installments);
      }
    } catch (error) {
      console.error('Failed to fetch installments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = installments.filter(
    (i) =>
      (statusFilter === 'all' || i.status === statusFilter) &&
      (typeFilter === 'all' || i.installmentType === typeFilter) &&
      (i.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        i.eventName?.toLowerCase().includes(search.toLowerCase()) ||
        i.quotationNumber?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAmount = installments.reduce((s, i) => s + i.amount, 0);
  const totalPaid = installments.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = installments.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = installments.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  const openNew = () => {
    setEditingInstallment(null);
    setForm({
      eventId: '',
      installmentType: 'installment',
      installmentNumber: 1,
      amount: '',
      dueDate: '',
      paymentDate: '',
      paymentMethod: '',
      transactionReference: '',
      status: 'pending',
      notes: '',
    });
    setShowModal(true);
  };

  const openEdit = (installment: Installment) => {
    setEditingInstallment(installment);
    setForm({
      eventId: installment.eventId,
      installmentType: installment.installmentType,
      installmentNumber: installment.installmentNumber,
      amount: installment.amount.toString(),
      dueDate: installment.dueDate || '',
      paymentDate: installment.paymentDate || '',
      paymentMethod: installment.paymentMethod || '',
      transactionReference: installment.transactionReference || '',
      status: installment.status,
      notes: installment.notes || '',
    });
    setShowModal(true);
  };

  const saveInstallment = async () => {
    setIsSaving(true);
    const payload = {
      ...(editingInstallment ? { id: editingInstallment.id } : {}),
      eventId: form.eventId,
      installmentType: form.installmentType,
      installmentNumber: Number(form.installmentNumber),
      amount: Number(form.amount),
      dueDate: form.dueDate || null,
      paymentDate: form.paymentDate || null,
      paymentMethod: form.paymentMethod || null,
      transactionReference: form.transactionReference || null,
      status: form.status,
      notes: form.notes || null,
    };

    const response = await fetch('/api/admin/payment-installments', {
      method: editingInstallment ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setIsSaving(false);

    if (response.ok && result.success) {
      await fetchInstallments();
      setShowModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const deleteInstallment = async (id: string) => {
    if (!confirm('Delete this installment?')) return;
    const response = await fetch(`/api/admin/payment-installments?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok) {
      setInstallments(installments.filter(i => i.id !== id));
    }
  };

  const markAsPaid = async (installment: Installment) => {
    const response = await fetch('/api/admin/payment-installments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: installment.id,
        status: 'paid',
        paymentDate: new Date().toISOString().split('T')[0],
      }),
    });

    if (response.ok) {
      await fetchInstallments();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-300">
          ✓ Installment saved successfully!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Payment Installments</h1>
          <p className="text-on-surface-variant mt-1">Track advance, installments, and final payments</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded-xl hover:bg-surface-container-high transition-all cursor-pointer text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Add Installment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Amount', value: `Rs. ${(totalAmount / 1000).toFixed(0)}K`, color: 'text-cream-contrast', icon: DollarSign },
          { label: 'Paid', value: `Rs. ${(totalPaid / 1000).toFixed(0)}K`, color: 'text-green-400', icon: CheckCircle },
          { label: 'Pending', value: `Rs. ${(totalPending / 1000).toFixed(0)}K`, color: 'text-yellow-400', icon: Clock },
          { label: 'Overdue', value: `Rs. ${(totalOverdue / 1000).toFixed(0)}K`, color: 'text-red-400', icon: AlertCircle },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container border border-outline-variant rounded-xl p-4">
            <div className="flex items-center gap-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <div>
                <p className="text-xs text-on-surface-variant">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input type="text" placeholder="Search by customer, event, or quotation..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'paid', 'overdue'] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${statusFilter === f ? 'bg-primary text-on-primary hover:scale-105' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50'}`}>
              {f}
            </button>
          ))}
          <div className="w-px bg-outline-variant" />
          {(['all', 'advance', 'installment', 'final'] as const).map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer capitalize ${typeFilter === f ? 'bg-primary text-on-primary hover:scale-105' : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-primary/50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Installments Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quotation</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Due Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Paid Date</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-on-surface-variant">Loading installments from Supabase...</td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-on-surface-variant">No installments found</td>
              </tr>
            )}
            {filtered.map((installment) => (
              <tr key={installment.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${installment.installmentType === 'advance' ? 'bg-blue-500/10 text-blue-400' : installment.installmentType === 'final' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                    {installment.installmentType} #{installment.installmentNumber}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-mono text-primary">{installment.quotationNumber || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-cream-contrast">{installment.customerName || 'N/A'}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-cream-contrast">Rs. {installment.amount.toLocaleString()}</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-on-surface-variant flex items-center gap-1">
                    {installment.dueDate ? (
                      <>
                        <Calendar className="w-3 h-3" /> {installment.dueDate}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-green-400">{installment.paymentDate || '-'}</p>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${installment.status === 'paid' ? 'bg-green-500/10 text-green-400' : installment.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {installment.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {installment.status === 'pending' && (
                      <button onClick={() => markAsPaid(installment)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 rounded-lg text-sm text-green-400 hover:bg-green-500/20 transition-all cursor-pointer">
                        <CheckCircle className="w-3 h-3" /> Pay
                      </button>
                    )}
                    <button onClick={() => openEdit(installment)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-high rounded-lg text-sm text-on-surface hover:text-cream-contrast hover:bg-surface-container-highest transition-all cursor-pointer">
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteInstallment(installment.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-cream-contrast font-display">{editingInstallment ? 'Edit Installment' : 'Add Installment'}</h3>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-on-surface-variant">Event ID</label>
                <input value={form.eventId} onChange={e => setForm({ ...form, eventId: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Enter event ID" disabled={!!editingInstallment} />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Type</label>
                  <select value={form.installmentType} onChange={e => setForm({ ...form, installmentType: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface">
                    <option value="advance">Advance</option>
                    <option value="installment">Installment</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div className="w-24">
                  <label className="text-xs text-on-surface-variant">Number</label>
                  <input type="number" min="1" value={form.installmentNumber} onChange={e => setForm({ ...form, installmentNumber: Number(e.target.value) })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" />
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant">Amount (Rs.)</label>
                <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="0" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Payment Date</label>
                  <input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Payment Method</label>
                  <select value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface">
                    <option value="">Not Paid Yet</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="eSewa">eSewa</option>
                    <option value="IME Pay">IME Pay</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-on-surface-variant">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant">Transaction Reference</label>
                <input value={form.transactionReference} onChange={e => setForm({ ...form, transactionReference: e.target.value })} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface" placeholder="Optional transaction ID or reference" />
              </div>

              <div>
                <label className="text-xs text-on-surface-variant">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-on-surface resize-none" placeholder="Optional notes..." />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer">Cancel</button>
              <button onClick={saveInstallment} disabled={!form.eventId || !form.amount || isSaving} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary/90 hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                {isSaving ? 'Saving...' : 'Save Installment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
