import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { desc, gte } from 'drizzle-orm';
import Link from 'next/link';
import { Plus, Calendar, CheckSquare, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  await requireAuth();

  const today = new Date().toISOString().split('T')[0];

  const allEvents = await db.query.events.findMany({
    with: {
      customer: true,
      eventType: true,
      coordinator: true,
      quotation: true,
    },
    orderBy: [desc(events.eventDate)],
  });

  // Separate upcoming and past events
  const upcomingEvents = allEvents.filter((e) => e.eventDate >= today);
  const pastEvents = allEvents.filter((e) => e.eventDate < today);

  // Calculate statistics
  const stats = {
    total: allEvents.length,
    upcoming: upcomingEvents.length,
    confirmed: allEvents.filter((e) => e.status === 'confirmed').length,
    inProgress: allEvents.filter((e) => e.status === 'in_progress').length,
    completed: allEvents.filter((e) => e.status === 'completed').length,
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      inquiry: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
      confirmed: 'bg-primary-container/20 text-primary border-primary-container/30',
      in_progress: 'bg-primary/20 text-primary border-primary/30',
      completed: 'bg-primary-container/20 text-primary-container border-primary-container/30',
      cancelled: 'bg-surface-container-high text-on-surface-variant border-outline-variant',
    };
    return styles[status] || 'bg-surface-container-high text-on-surface-variant border-outline-variant';
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-cream-contrast">Events</h1>
          <p className="text-on-surface-variant mt-1">Manage event operations and coordination</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center space-x-2 bg-primary text-surface px-6 py-3 rounded hover:bg-primary-container transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>New Event</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-surface-container border border-outline-variant rounded p-4">
          <div className="text-sm text-on-surface-variant mb-1">Total Events</div>
          <div className="text-3xl font-bold text-cream-contrast">{stats.total}</div>
        </div>
        <div className="bg-primary-container/10 border border-primary-container/30 rounded p-4">
          <div className="text-sm text-primary mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-primary">{stats.upcoming}</div>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded p-4">
          <div className="text-sm text-primary-container mb-1">Confirmed</div>
          <div className="text-3xl font-bold text-primary-container">{stats.confirmed}</div>
        </div>
        <div className="bg-muted-gold/10 border border-muted-gold/30 rounded p-4">
          <div className="text-sm text-muted-gold mb-1">In Progress</div>
          <div className="text-3xl font-bold text-muted-gold">{stats.inProgress}</div>
        </div>
        <div className="bg-champagne-gold/10 border border-champagne-gold/30 rounded p-4">
          <div className="text-sm text-champagne-gold mb-1">Completed</div>
          <div className="text-3xl font-bold text-champagne-gold">{stats.completed}</div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-surface-container border border-outline-variant rounded overflow-hidden">
        <div className="p-6 border-b border-outline-variant bg-gradient-to-r from-primary-container/5 to-muted-gold/5">
          <h2 className="text-xl font-bold font-display text-cream-contrast flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-primary" />
            Upcoming Events
          </h2>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-3 text-on-surface-variant/50" />
            <h3 className="text-lg font-semibold text-cream-contrast mb-2">No upcoming events</h3>
            <p className="text-on-surface-variant mb-6">Create an event from an accepted quotation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Event ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Coordinator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {upcomingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-container-high transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm font-semibold text-primary">
                        {event.eventId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-cream-contrast">{event.name}</div>
                      <div className="text-sm text-on-surface-variant">{event.eventType?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-cream-contrast">{event.customer?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-on-surface">
                        <Calendar className="w-4 h-4 mr-2 text-on-surface-variant" />
                        {new Date(event.eventDate).toLocaleDateString('en-NP', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      {event.startTime && (
                        <div className="text-xs text-on-surface-variant">{event.startTime}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-on-surface max-w-xs truncate">{event.venue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">
                      {event.coordinator?.name || (
                        <span className="text-on-surface-variant italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {getStatusLabel(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-primary hover:text-primary-container font-semibold transition"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Past Events (Collapsible) */}
      {pastEvents.length > 0 && (
        <details className="bg-surface-container border border-outline-variant rounded">
          <summary className="p-6 cursor-pointer hover:bg-surface-container-high transition">
            <span className="text-lg font-bold font-display text-cream-contrast">
              Past Events ({pastEvents.length})
            </span>
          </summary>
          <div className="overflow-x-auto border-t border-outline-variant">
            <table className="w-full">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Event ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {pastEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-container-high transition">
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">{event.eventId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-cream-contrast">{event.name}</td>
                    <td className="px-6 py-4 text-sm text-on-surface">
                      {new Date(event.eventDate).toLocaleDateString('en-NP')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {getStatusLabel(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="text-primary hover:text-primary-container font-semibold"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
