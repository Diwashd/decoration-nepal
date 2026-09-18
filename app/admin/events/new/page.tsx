import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { quotations } from '@/lib/db/schema';
import { notFound } from 'next/navigation';
import NewEventForm from '@/components/admin/NewEventForm';

export const dynamic = 'force-dynamic';

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ quotationId?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const quotationId = params.quotationId;

  let quotation = null;
  if (quotationId) {
    quotation = await db.query.quotations.findFirst({
      where: (quotations, { eq }) => eq(quotations.id, quotationId),
      with: {
        customer: true,
        lead: {
          with: {
            eventType: true,
          },
        },
        items: true,
      },
    });

    if (!quotation) {
      notFound();
    }

    // Only allow creating events from accepted quotations
    if (quotation.status !== 'accepted') {
      throw new Error('Can only create events from accepted quotations');
    }
  }

  // Get coordinators (event coordinators, admins, super admins)
  const coordinators = await db.query.users.findMany({
    where: (users, { or, eq }) =>
      or(
        eq(users.role, 'admin'),
        eq(users.role, 'super_admin'),
        eq(users.role, 'event_coordinator')
      ),
    orderBy: (users, { asc }) => [asc(users.name)],
  });

  // Get themes and color palettes
  const [themes, colorPalettes] = await Promise.all([
    db.query.themes.findMany({
      where: (themes, { eq }) => eq(themes.isActive, true),
      orderBy: (themes, { asc }) => [asc(themes.name)],
    }),
    db.query.colorPalettes.findMany({
      where: (colorPalettes, { eq }) => eq(colorPalettes.isActive, true),
      orderBy: (colorPalettes, { asc }) => [asc(colorPalettes.name)],
    }),
  ]);

  return (
    <NewEventForm
      user={user}
      quotation={quotation}
      coordinators={coordinators}
      themes={themes}
      colorPalettes={colorPalettes}
    />
  );
}
