import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, Calendar, User, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  await requireAuth();

  const allLeads = await db.query.leads.findMany({
    with: {
      customer: true,
      eventType: true,
      assignedSalesperson: true,
    },
    orderBy: [desc(leads.createdAt)],
  });

  // Calculate statistics
  const stats = {
    total: allLeads.length,
    new: allLeads.filter((l) => l.status === 'new').length,
    contacted: allLeads.filter((l) => l.status === 'contacted').length,
    quoted: allLeads.filter((l) => l.status === 'quoted').length,
    won: allLeads.filter((l) => l.status === 'won').length,
    lost: allLeads.filter((l) => l.status === 'lost').length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-primary-container/20 text-primary border-primary/30',
      contacted: 'bg-muted-gold/20 text-champagne-gold border-muted-gold/30',
      quoted: 'bg-primary/20 text-primary border-primary/30',
      won: 'bg-primary-container/20 text-primary border-primary-container/30',
      lost: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
    };
    return styles[status] || 'bg-surface-container-high text-on-surface-variant border-outline-variant';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: 'New',
      contacted: 'Contacted',
      quoted: 'Quoted',
      won: 'Won',
      lost: 'Lost',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Leads</h1>
          <p className="text-on-surface-variant mt-1">Manage event inquiries and conversions</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-surface-container border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Total Leads</div>
          <div className="text-3xl font-bold text-cream-contrast">{stats.total}</div>
        </div>
        <div className="bg-primary-container/10 border border-primary-container/30 rounded p-4">
          <div className="text-sm text-primary mb-1">New</div>
          <div className="text-3xl font-bold text-primary">{stats.new}</div>
        </div>
        <div className="bg-muted-gold/10 border border-muted-gold/30 rounded p-4">
          <div className="text-sm text-muted-gold mb-1">Contacted</div>
          <div className="text-3xl font-bold text-muted-gold">{stats.contacted}</div>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded p-4">
          <div className="text-sm text-primary mb-1">Quoted</div>
          <div className="text-3xl font-bold text-primary">{stats.quoted}</div>
        </div>
        <div className="bg-primary-container/10 border border-primary-container/30 rounded p-4">
          <div className="text-sm text-primary-container mb-1">Won</div>
          <div className="text-3xl font-bold text-primary-container">{stats.won}</div>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Lost</div>
          <div className="text-3xl font-bold text-on-surface-variant">{stats.lost}</div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
        {allLeads.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-on-surface-variant/50 mb-4">
              <User className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-cream-contrast mb-2">No leads yet</h3>
            <p className="text-on-surface-variant mb-6">
              Leads will appear here when customers use the event planner
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Event Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {allLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-surface-container-high transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-cream-contrast">
                            {lead.customer?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-on-surface-variant">{lead.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
                        {lead.eventType?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-on-surface">
                        <Calendar className="w-4 h-4 mr-2 text-on-surface-variant" />
                        {new Date(lead.eventDate).toLocaleDateString('en-NP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-on-surface max-w-xs truncate">
                        <MapPin className="w-4 h-4 mr-2 text-on-surface-variant flex-shrink-0" />
                        {lead.venue || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-on-surface">
                        <DollarSign className="w-4 h-4 mr-1 text-on-surface-variant" />
                        {lead.budgetRange || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                      {lead.assignedSalesperson?.name || (
                        <span className="text-on-surface-variant italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-primary hover:text-primary-container font-semibold transition"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
