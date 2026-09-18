import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { packages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import EditPackageForm from '@/components/admin/EditPackageForm';

export const dynamic = 'force-dynamic';

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const pkg = await db.query.packages.findFirst({
    where: eq(packages.id, id),
    with: {
      eventType: true,
      packageItems: {
        with: {
          service: true,
        },
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  const eventTypes = await db.query.eventTypes.findMany({
    orderBy: (eventTypes, { asc }) => [asc(eventTypes.name)],
  });

  return <EditPackageForm package={pkg} eventTypes={eventTypes} />;
}
