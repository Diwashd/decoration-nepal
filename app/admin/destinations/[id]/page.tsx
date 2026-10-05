import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { destinations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import DestinationForm from '@/components/admin/DestinationForm';

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const destination = await db.query.destinations.findFirst({ where: eq(destinations.id, id) });
  if (!destination) notFound();
  const amenities = Array.isArray(destination.amenities)
    ? destination.amenities.filter((item): item is string => typeof item === 'string')
    : [];
  return <DestinationForm destination={{ ...destination, amenities }} />;
}
