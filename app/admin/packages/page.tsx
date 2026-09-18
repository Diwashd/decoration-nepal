import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { packages, eventTypes } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { Package, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
  await requireAuth();

  const [allPackages, allEventTypes] = await Promise.all([
    db.query.packages.findMany({
      orderBy: [desc(packages.createdAt)],
      with: {
        eventType: true,
      },
    }),
    db.query.eventTypes.findMany({
      orderBy: (eventTypes, { asc }) => [asc(eventTypes.name)],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Packages</h1>
          <p className="text-on-surface-variant mt-1">Manage decoration packages for customers</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center space-x-2 bg-primary text-surface px-4 py-2.5 rounded hover:bg-primary-container transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>New Package</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container border border-outline-variant p-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant font-medium">Total Packages</p>
              <p className="text-2xl font-bold text-cream-contrast mt-1">{allPackages.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant font-medium">Active</p>
              <p className="text-2xl font-bold text-primary mt-1">
                {allPackages.filter(p => p.isActive).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant font-medium">Inactive</p>
              <p className="text-2xl font-bold text-on-surface-variant mt-1">
                {allPackages.filter(p => !p.isActive).length}
              </p>
            </div>
            <EyeOff className="w-8 h-8 text-on-surface-variant" />
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant p-6 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-on-surface-variant font-medium">Event Types</p>
              <p className="text-2xl font-bold text-cream-contrast mt-1">{allEventTypes.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary-container" />
          </div>
        </div>
      </div>

      {/* Packages List */}
      <div className="bg-surface-container border border-outline-variant rounded">
        <div className="p-6">
          <h2 className="text-xl font-bold font-display text-cream-contrast mb-4">All Packages</h2>

          {allPackages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-3" />
              <p className="text-on-surface-variant mb-4">No packages created yet</p>
              <Link
                href="/admin/packages/new"
                className="inline-flex items-center space-x-2 bg-primary text-surface px-6 py-2.5 rounded hover:bg-primary-container transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Package</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Package Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Event Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Base Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-on-surface-variant">Created</th>
                    <th className="text-right py-3 px-4 font-semibold text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-outline-variant hover:bg-surface-container-high transition">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-cream-contrast">{pkg.name}</div>
                        {pkg.description && (
                          <div className="text-sm text-on-surface-variant line-clamp-1 mt-0.5">{pkg.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                          {pkg.eventType.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-cream-contrast">{formatCurrency(pkg.basePrice)}</span>
                      </td>
                      <td className="py-4 px-4">
                        {pkg.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-primary-container/20 text-primary border border-primary-container/30">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-surface-container-high text-on-surface-variant border border-outline-variant">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-on-surface-variant">
                        {new Date(pkg.createdAt).toLocaleDateString('en-NP')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/packages/${pkg.id}`}
                            className="p-2 text-primary hover:bg-surface-container-high rounded transition"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
