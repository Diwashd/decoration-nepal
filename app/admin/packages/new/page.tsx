import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { eventTypes } from '@/lib/db/schema';
import NewPackageForm from '@/components/admin/NewPackageForm';

export const dynamic = 'force-dynamic';

export default async function NewPackagePage() {
  await requireAuth();

  const allEventTypes = await db.query.eventTypes.findMany({
    where: (eventTypes, { eq }) => eq(eventTypes.isActive, true),
    orderBy: (eventTypes, { asc }) => [asc(eventTypes.name)],
  });

  return <NewPackageForm eventTypes={allEventTypes} />;
}
