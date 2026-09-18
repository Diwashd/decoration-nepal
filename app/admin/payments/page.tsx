'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Search, Download, Plus, Edit3, Trash2, X, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

type GroupedInstallments = {
  eventId: string;
  eventName: string | null;
  customerName: string | null;
  quotationNumber: string | null;
  installments: Installment[];
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
};

export default function AdminPaymentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    eventId: '',
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

  // Group installments by event
  const groupedData: GroupedInstallments[] = installments.reduce((acc, inst) => {
    let group = acc.find(g => g.eventId === inst.eventId);
    if (!group) {
      group = {
        eventId: inst.eventId,
        eventName: inst.eventName,
        customerName: inst.customerName,
        quotationNumber: inst.quotationNumber,
        installments: [],
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      };
      acc.push(group);
    }
    group.installments.push(inst);
    group.totalAmount += inst.amount;
    if (inst.status === 'paid') {
      group.paidAmount += inst.amount;
    } else {
      group.pendingAmount += inst.amount;
    }
    return acc;
  }, [] as GroupedInstallments[]);

  // Sort installments within each group by installment number
  groupedData.forEach(g => {
    g.installments.sort((a, b) => a.installmentNumber - b.installmentNumber);
  });

  // Filter groups
  const filteredGroups = groupedData.filter(g => {
    const matchesSearch = search === '' ||
      g.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      g.eventName?.toLowerCase().includes(search.toLowerCase()) ||
      g.quotationNumber?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      g.installments.some(i => i.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = installments.reduce((s, i) => s + i.amount, 0);
  const totalPaid = installments.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = installments.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const openAddInstallment = (eventId: string) => {
    const group = groupedData.find(g => g.eventId === eventId);
    const maxInstallmentNumber = group ? Math.max(...group.installments.map(i => i.installmentNumber), 0) : 0;

    setEditingInstallment(null);
    setSelectedEventId(eventId);
    setForm({
      eventId: eventId,
      installmentNumber: maxInstallmentNumber + 1,
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
    setSelectedEventId(installment.eventId);
    setForm({
      eventId: installment.eventId,
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
      installmentType: form.installmentNumber === 1 ? 'advance' : 'installment',
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
    if (!confirm('Are you sure you want to delete this installment?')) return;

    const response = await fetch(`/api/admin/payment-installments?id=${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      await fetchInstallments();
    }
  };

  const markAsPaid = async (installment: Installment) => {
    const payload = {
      id: installment.id,
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: installment.paymentMethod || 'Bank Transfer',
    };

    const response = await fetch('/api/admin/payment-installments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await fetchInstallments();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ Saved successfully!
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payment Installments</h1>
            <p className="text-gray-600 mt-1">Track and manage payment installments by quotation</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">Rs. {totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Amount</p>
                <p className="text-2xl font-bold text-green-600 mt-1">Rs. {totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">Rs. {totalPending.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer, event, or quotation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Grouped Installments */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white p-12 rounded-xl shadow-md text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading installments...</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-md text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No installments found</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.eventId} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{group.quotationNumber || 'N/A'}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Customer: <span className="font-medium">{group.customerName || 'N/A'}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Event: <span className="font-medium">{group.eventName || 'N/A'}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total: <span className="font-bold text-gray-800">Rs. {group.totalAmount.toLocaleString()}</span></p>
                      <p className="text-sm text-green-600">Paid: Rs. {group.paidAmount.toLocaleString()}</p>
                      <p className="text-sm text-orange-600">Pending: Rs. {group.pendingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {group.installments.map((inst) => (
                      <div key={inst.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              Installment {inst.installmentNumber}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              inst.status === 'paid' ? 'bg-green-100 text-green-700' :
                              inst.status === 'overdue' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                            </span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Amount</p>
                              <p className="font-semibold text-gray-800">Rs. {inst.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Due Date</p>
                              <p className="font-semibold text-gray-800">{inst.dueDate || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Date</p>
                              <p className="font-semibold text-gray-800">{inst.paymentDate || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Method</p>
                              <p className="font-semibold text-gray-800">{inst.paymentMethod || 'N/A'}</p>
                            </div>
                          </div>
                          {inst.notes && (
                            <p className="mt-2 text-sm text-gray-600 italic">{inst.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {inst.status === 'pending' && (
                            <button
                              onClick={() => markAsPaid(inst)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-medium"
                            >
                              Mark as Paid
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(inst)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteInstallment(inst.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => openAddInstallment(group.eventId)}
                    className="mt-4 w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Installment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingInstallment ? 'Edit Installment' : 'Add New Installment'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installment Number
                </label>
                <input
                  type="number"
                  value={form.installmentNumber}
                  onChange={(e) => setForm({ ...form, installmentNumber: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!!editingInstallment}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (Rs.)
                </label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Reference
                </label>
                <input
                  type="text"
                  value={form.transactionReference}
                  onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
                  placeholder="Optional transaction ID or reference"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveInstallment}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Installment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
