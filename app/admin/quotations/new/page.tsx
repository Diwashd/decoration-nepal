import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { notFound } from 'next/navigation';
import NewQuotationForm from '@/components/admin/NewQuotationForm';

export const dynamic = 'force-dynamic';

export default async function NewQuotationPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const leadId = params.leadId;

  let lead = null;
  if (leadId) {
    lead = await db.query.leads.findFirst({
      where: (leads, { eq }) => eq(leads.id, leadId),
      with: {
        customer: true,
        eventType: true,
      },
    });

    if (!lead) {
      notFound();
    }
  }

  // Get all services for the quotation builder
  const services = await db.query.services.findMany({
    where: (services, { eq }) => eq(services.isActive, true),
    orderBy: (services, { asc }) => [asc(services.name)],
  });

  // Get all packages
  const packages = await db.query.packages.findMany({
    where: (packages, { eq }) => eq(packages.isActive, true),
    with: {
      eventType: true,
    },
    orderBy: (packages, { asc }) => [asc(packages.name)],
  });

  return (
    <NewQuotationForm
      user={user}
      lead={lead}
      services={services}
      packages={packages}
    />
  );
}
