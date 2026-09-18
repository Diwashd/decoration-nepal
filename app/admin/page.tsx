import { db } from '@/lib/db';
import { events, leads, quotations, payments } from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import { TrendingUp, Users, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminDashboardWidgets from '@/components/admin/AdminDashboardWidgets';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Get date ranges
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - 7);

  // Fetch KPIs
  const [
    newLeadsCount,
    activeEventsCount,
    pendingQuotationsCount,
    monthRevenue,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(leads).where(gte(leads.createdAt, startOfWeek)),
    db.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.status, 'confirmed')),
    db.select({ count: sql<number>`count(*)` }).from(quotations).where(eq(quotations.status, 'sent')),
    db.select({ total: sql<number>`sum(amount)` }).from(payments).where(gte(payments.paymentDate, startOfMonth.toISOString().split('T')[0])),
  ]);

  const stats = [
    {
      name: 'New Leads',
      value: newLeadsCount[0]?.count || 0,
      icon: Users,
      color: 'bg-primary-container',
      change: '+12%',
    },
    {
      name: 'Active Events',
      value: activeEventsCount[0]?.count || 0,
      icon: Calendar,
      color: 'bg-muted-gold',
      change: '+8%',
    },
    {
      name: 'Pending Quotes',
      value: pendingQuotationsCount[0]?.count || 0,
      icon: FileText,
      color: 'bg-champagne-gold',
      change: '+5%',
    },
    {
      name: 'Month Revenue',
      value: formatCurrency(monthRevenue[0]?.total || 0),
      icon: DollarSign,
      color: 'bg-primary',
      change: '+15%',
    },
  ];

  // Fetch upcoming events
  const upcomingEvents = await db.query.events.findMany({
    where: and(
      gte(events.eventDate, today.toISOString().split('T')[0]),
      eq(events.status, 'confirmed')
    ),
    limit: 5,
    orderBy: (events, { asc }) => [asc(events.eventDate)],
    with: {
      customer: true,
      eventType: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display text-cream-contrast">Dashboard</h2>
        <p className="text-on-surface-variant">Welcome to 11:11 Decoration Nepal Operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-surface-container border border-outline-variant rounded p-6 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant font-medium">{stat.name}</p>
                <p className="text-2xl font-bold text-cream-contrast mt-2">{stat.value}</p>
                <p className="text-sm text-primary font-medium mt-1">{stat.change} from last period</p>
              </div>
              <div className={`${stat.color} p-3 rounded`}>
                <stat.icon className="w-6 h-6 text-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-surface-container border border-outline-variant rounded p-6">
        <h3 className="text-lg font-bold font-display text-cream-contrast mb-4">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-on-surface-variant/50" />
            <p>No upcoming confirmed events</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-surface-container-low rounded hover:bg-surface-container-high transition border border-outline-variant">
                <div>
                  <div className="font-semibold text-cream-contrast">{event.name}</div>
                  <div className="text-sm text-on-surface-variant">{event.customer.name} • {event.eventType.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-on-surface">{new Date(event.eventDate).toLocaleDateString('en-NP')}</div>
                  <div className="text-xs text-on-surface-variant">{event.venue}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminDashboardWidgets />
    </div>
  );
}
