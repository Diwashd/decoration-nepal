import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { leads, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import LeadDetailView from '@/components/admin/LeadDetailView';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const lead = await db.query.leads.findFirst({
    where: eq(leads.id, id),
    with: {
      customer: true,
      eventType: true,
      assignedSalesperson: true,
    },
  });

  if (!lead) {
    notFound();
  }

  // Get all sales users for assignment dropdown
  const salesUsers = await db.query.users.findMany({
    where: (users, { or, eq }) =>
      or(
        eq(users.role, 'admin'),
        eq(users.role, 'super_admin'),
        eq(users.role, 'sales_manager')
      ),
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  return <LeadDetailView lead={lead} salesUsers={salesUsers} />;
}
