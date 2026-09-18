'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, FileText, Download, Filter } from 'lucide-react';
import AnimatedSection from '@/components/customer/AnimatedSection';

const mockReportData = {
  revenue: { total: 2450000, monthly: 385000, growth: 12.5 },
  leads: { total: 156, thisMonth: 23, conversionRate: 34.2 },
  events: { total: 89, upcoming: 12, completed: 72, cancelled: 5 },
  quotations: { total: 134, sent: 45, accepted: 38, rejected: 7 },
};

const monthlyRevenue = [
  { month: 'Jan', revenue: 180000 },
  { month: 'Feb', revenue: 220000 },
  { month: 'Mar', revenue: 350000 },
  { month: 'Apr', revenue: 280000 },
  { month: 'May', revenue: 420000 },
  { month: 'Jun', revenue: 385000 },
];

const topEventTypes = [
  { name: 'Wedding', count: 42, revenue: 1200000 },
  { name: 'Birthday', count: 28, revenue: 450000 },
  { name: 'Anniversary', count: 18, revenue: 380000 },
  { name: 'Pasni', count: 12, revenue: 220000 },
  { name: 'Corporate', count: 8, revenue: 200000 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-contrast font-display flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-on-surface-variant mt-1">Business insights and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-surface-container-high text-cream-contrast py-2.5 px-4 rounded border border-outline focus:border-primary focus:outline-none text-sm">
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
          <button className="flex items-center space-x-2 border border-outline text-on-surface-variant px-4 py-2.5 rounded hover:bg-surface-container-high transition font-semibold text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Revenue</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-cream-contrast font-display">NPR {mockReportData.revenue.monthly.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">+{mockReportData.revenue.growth}% from last month</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Leads</span>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-cream-contrast font-display">{mockReportData.leads.thisMonth}</p>
          <p className="text-xs text-on-surface-variant mt-1">{mockReportData.leads.conversionRate}% conversion rate</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Events</span>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-cream-contrast font-display">{mockReportData.events.upcoming}</p>
          <p className="text-xs text-on-surface-variant mt-1">{mockReportData.events.completed} completed this year</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant uppercase tracking-widest">Quotations</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-cream-contrast font-display">{mockReportData.quotations.accepted}</p>
          <p className="text-xs text-on-surface-variant mt-1">Accepted this month</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="col-span-8 bg-surface-container border border-outline-variant rounded-xl p-6">
          <h3 className="text-lg font-bold text-cream-contrast mb-6">Revenue Trend</h3>
          <div className="flex items-end gap-3 h-48">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary/20 rounded-t relative" style={{ height: `${(m.revenue / 420000) * 100}%` }}>
                  <div className="absolute bottom-0 w-full bg-primary rounded-t transition-all" style={{ height: '100%' }} />
                </div>
                <span className="text-xs text-on-surface-variant">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Event Types */}
        <div className="col-span-4 bg-surface-container border border-outline-variant rounded-xl p-6">
          <h3 className="text-lg font-bold text-cream-contrast mb-6">Top Event Types</h3>
          <div className="space-y-4">
            {topEventTypes.map((et, i) => (
              <div key={et.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-cream-contrast">{et.name}</span>
                  <span className="text-xs text-on-surface-variant">{et.count} events</span>
                </div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(et.count / 42) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
