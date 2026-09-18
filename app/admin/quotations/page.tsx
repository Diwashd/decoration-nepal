import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { quotations } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, FileText, Calendar, DollarSign, User, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function QuotationsPage() {
  await requireAuth();

  const allQuotations = await db.query.quotations.findMany({
    with: {
      customer: true,
      lead: {
        with: {
          eventType: true,
        },
      },
      createdBy: true,
    },
    orderBy: [desc(quotations.createdAt)],
  });

  // Calculate statistics
  const stats = {
    total: allQuotations.length,
    draft: allQuotations.filter((q) => q.status === 'draft').length,
    sent: allQuotations.filter((q) => q.status === 'sent').length,
    accepted: allQuotations.filter((q) => q.status === 'accepted').length,
    rejected: allQuotations.filter((q) => q.status === 'rejected').length,
    totalValue: allQuotations.reduce((sum, q) => sum + q.totalAmount, 0),
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
      sent: 'bg-primary-container/20 text-primary border-primary-container/30',
      accepted: 'bg-primary/20 text-primary border-primary/30',
      rejected: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
    };
    return styles[status] || 'bg-surface-container-high text-on-surface-variant border-outline-variant';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      sent: 'Sent',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Quotations</h1>
          <p className="text-on-surface-variant mt-1">Create and manage event quotations</p>
        </div>
        <Link
          href="/admin/quotations/new"
          className="flex items-center space-x-2 bg-primary text-surface px-6 py-3 rounded hover:bg-primary-container transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>New Quotation</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-surface-container border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Total</div>
          <div className="text-3xl font-bold text-cream-contrast">{stats.total}</div>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Draft</div>
          <div className="text-3xl font-bold text-on-surface-variant">{stats.draft}</div>
        </div>
        <div className="bg-primary-container/10 border border-primary-container/30 rounded p-4">
          <div className="text-sm text-primary mb-1">Sent</div>
          <div className="text-3xl font-bold text-primary">{stats.sent}</div>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded p-4">
          <div className="text-sm text-primary-container mb-1">Accepted</div>
          <div className="text-3xl font-bold text-primary-container">{stats.accepted}</div>
        </div>
        <div className="bg-surface-container-high border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Rejected</div>
          <div className="text-3xl font-bold text-on-surface-variant">{stats.rejected}</div>
        </div>
        <div className="bg-gradient-to-br from-primary-container/10 to-muted-gold/10 border border-primary/30 rounded p-4">
          <div className="text-sm text-primary mb-1">Total Value</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(stats.totalValue)}
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
        {allQuotations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-on-surface-variant/50 mb-4">
              <FileText className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-cream-contrast mb-2">No quotations yet</h3>
            <p className="text-on-surface-variant mb-6">Create your first quotation from a lead</p>
            <Link
              href="/admin/quotations/new"
              className="inline-flex items-center space-x-2 bg-primary text-surface px-6 py-3 rounded hover:bg-primary-container transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>New Quotation</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Quotation #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Event Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {allQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-surface-container-high transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-semibold text-cream-contrast">
                        {quotation.quotationNumber}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        v{quotation.version}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="ml-3">
                          <div className="font-semibold text-cream-contrast">
                            {quotation.customer?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-on-surface-variant">{quotation.customer?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/30">
                        {quotation.lead?.eventType?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-cream-contrast text-lg">
                        {formatCurrency(quotation.totalAmount)}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        Items included
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-on-surface">
                        <Calendar className="w-4 h-4 mr-2 text-on-surface-variant" />
                        {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString('en-NP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : 'No expiry'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                          quotation.status
                        )}`}
                      >
                        {getStatusLabel(quotation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                      {quotation.createdBy?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/quotations/${quotation.id}`}
                        className="text-primary hover:text-primary-container font-semibold transition flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
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
