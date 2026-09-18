import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { quotations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import QuotationDetailView from '@/components/admin/QuotationDetailView';

export const dynamic = 'force-dynamic';

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth();
  const { id } = await params;

  const quotation = await db.query.quotations.findFirst({
    where: eq(quotations.id, id),
    with: {
      customer: true,
      lead: {
        with: {
          eventType: true,
        },
      },
      createdBy: true,
      items: true,
    },
  });

  if (!quotation) {
    notFound();
  }

  return <QuotationDetailView quotation={quotation} user={user} />;
}
