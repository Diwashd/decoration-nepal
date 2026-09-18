'use client';

import { useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, MapPin, Plus, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

const mockCustomers = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+977-9841234567',
    address: 'Baneshwor, Kathmandu',
    totalEvents: 3,
    totalSpent: 450000,
    joinedDate: '2025-03-15',
    lastEvent: '2026-07-20',
    status: 'active',
  },
  {
    id: '2',
    name: 'Rajan Thapa',
    email: 'rajan.thapa@outlook.com',
    phone: '+977-9851234567',
    address: 'Lalitpur, Nepal',
    totalEvents: 1,
    totalSpent: 250000,
    joinedDate: '2025-08-10',
    lastEvent: '2026-06-15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Anita Gurung',
    email: 'anita.g@gmail.com',
    phone: '+977-9861234567',
    address: 'Pokhara, Nepal',
    totalEvents: 2,
    totalSpent: 380000,
    joinedDate: '2025-11-20',
    lastEvent: '2026-08-01',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sanjay Magar',
    email: 'sanjay.m@yahoo.com',
    phone: '+977-9801234567',
    address: 'Bhaktapur, Nepal',
    totalEvents: 1,
    totalSpent: 180000,
    joinedDate: '2026-01-05',
    lastEvent: '2026-05-10',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Neha Karki',
    email: 'neha.karki@gmail.com',
    phone: '+977-9811234567',
    address: 'Dillibazar, Kathmandu',
    totalEvents: 4,
    totalSpent: 720000,
    joinedDate: '2024-12-01',
    lastEvent: '2026-08-15',
    status: 'active',
  },
  {
    id: '6',
    name: 'Bikash Rai',
    email: 'bikash.rai@company.com',
    phone: '+977-9821234567',
    address: 'Kamaladi, Kathmandu',
    totalEvents: 2,
    totalSpent: 340000,
    joinedDate: '2025-06-15',
    lastEvent: '2026-07-28',
    status: 'active',
  },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalRevenue = mockCustomers.reduce((s, c) => s + c.totalSpent, 0);
  const activeCount = mockCustomers.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Customers</h1>
          <p className="text-on-surface-variant mt-1">Manage your customer database</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: mockCustomers.length, icon: Users, color: 'text-primary' },
          { label: 'Active', value: activeCount, icon: Users, color: 'text-green-400' },
          { label: 'Total Events', value: mockCustomers.reduce((s, c) => s + c.totalEvents, 0), icon: Calendar, color: 'text-blue-400' },
          { label: 'Total Revenue', value: `Rs. ${(totalRevenue / 1000).toFixed(0)}K`, icon: Users, color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container border border-outline-variant rounded-xl p-4">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-on-surface-variant">{stat.label}</p>
                <p className="text-xl font-bold text-cream-contrast">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Customer Table */}
      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Events</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Total Spent</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-cream-contrast text-sm">{customer.name}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {customer.address}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <p className="text-sm text-on-surface flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</p>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</p>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-cream-contrast font-medium">{customer.totalEvents}</span>
                  <p className="text-xs text-on-surface-variant">Last: {customer.lastEvent}</p>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className="text-sm text-primary font-semibold">Rs. {customer.totalSpent.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${customer.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                    className="p-1.5 hover:bg-surface-container-high rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (() => {
        const customer = mockCustomers.find(c => c.id === selectedCustomer);
        if (!customer) return null;
        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-surface-container border border-outline-variant rounded-2xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-cream-contrast font-display">{customer.name}</h3>
                <button onClick={() => setSelectedCustomer(null)} className="text-on-surface-variant hover:text-cream-contrast">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-on-surface-variant">Email:</span><p className="text-cream-contrast">{customer.email}</p></div>
                <div><span className="text-on-surface-variant">Phone:</span><p className="text-cream-contrast">{customer.phone}</p></div>
                <div><span className="text-on-surface-variant">Address:</span><p className="text-cream-contrast">{customer.address}</p></div>
                <div><span className="text-on-surface-variant">Joined:</span><p className="text-cream-contrast">{customer.joinedDate}</p></div>
                <div><span className="text-on-surface-variant">Total Events:</span><p className="text-cream-contrast">{customer.totalEvents}</p></div>
                <div><span className="text-on-surface-variant">Total Spent:</span><p className="text-primary font-semibold">Rs. {customer.totalSpent.toLocaleString()}</p></div>
                <div><span className="text-on-surface-variant">Last Event:</span><p className="text-cream-contrast">{customer.lastEvent}</p></div>
                <div><span className="text-on-surface-variant">Status:</span>
                  <span className={`ml-1 text-xs font-medium px-2 py-0.5 rounded-full ${customer.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {customer.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
