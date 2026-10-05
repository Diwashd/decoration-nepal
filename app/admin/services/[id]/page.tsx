import { requireAuth } from '@/lib/services/session';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import ServiceForm from '@/components/admin/ServiceForm';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;
  const service = await db.query.services.findFirst({ where: eq(services.id, id) });
  if (!service) notFound();
  const image = Array.isArray(service.images) && service.images[0] && typeof service.images[0] === 'object'
    ? (service.images[0] as { image?: string }).image || ''
    : '';
  const metadata = Array.isArray(service.images) && service.images[0] && typeof service.images[0] === 'object' ? service.images[0] as { category?: string; icon?: string; featured?: boolean } : {};
  return <ServiceForm service={{ id: service.id, name: service.name, description: service.description || '', price: `Rs. ${service.basePrice.toLocaleString('en-NP')}`, active: service.isActive, order: service.sortOrder, image, category: metadata.category || 'core', icon: metadata.icon || '✨', featured: metadata.featured === true, seoTitle: service.seoTitle, seoDescription: service.seoDescription, seoKeywords: service.seoKeywords }} />;
}
