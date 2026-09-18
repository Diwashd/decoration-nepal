import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditLogs, services } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { desc, eq } from 'drizzle-orm';

function toServiceView(service: typeof services.$inferSelect) {
  const images = Array.isArray(service.images) ? service.images : [];
  const metadata = images[0] && typeof images[0] === 'object' ? images[0] as Record<string, unknown> : {};
  return {
    ...service,
    active: service.isActive,
    category: metadata.category === 'additional' ? 'additional' : 'core',
    price: `Rs. ${service.basePrice.toLocaleString('en-NP')}`,
    icon: typeof metadata.icon === 'string' ? metadata.icon : '✨',
    featured: metadata.featured === true,
    order: service.sortOrder,
    image: typeof metadata.image === 'string' ? metadata.image : '',
  };
}

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const records = await db.query.services.findMany({ orderBy: [desc(services.createdAt)] });
    return NextResponse.json({ success: true, services: records.map(toServiceView) });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.name || !Number.isFinite(Number(data.basePrice)) || Number(data.basePrice) < 0) {
      return NextResponse.json({ success: false, error: 'Name and a valid price are required' }, { status: 400 });
    }

    const [service] = await db.insert(services).values({
      name: data.name,
      description: data.description || null,
      eventTypes: data.eventTypes || [],
      pricingModel: data.pricingModel || 'fixed',
      basePrice: Number(data.basePrice),
      costPrice: Number(data.costPrice) || 0,
      unit: data.unit || 'item',
      isActive: data.isActive !== false,
      sortOrder: Number(data.order) || 0,
      images: [{
        category: data.category || 'core',
        icon: data.icon || '✨',
        featured: data.featured === true,
        order: Number(data.order) || 0,
        image: data.image || '',
      }],
    }).returning();

    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'SERVICE_CREATED',
      tableName: 'services',
      recordId: service.id,
      newValue: { name: service.name },
    });

    return NextResponse.json({ success: true, service: toServiceView(service) });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Service id is required' }, { status: 400 });
    }

    const update = typeof data.active === 'boolean' && !data.name
      ? { isActive: data.active, updatedAt: new Date() }
      : {
          name: data.name,
          description: data.description || null,
          basePrice: Number(data.basePrice),
          sortOrder: Number(data.order) || 0,
          isActive: data.active !== false,
          images: [{
            category: data.category || 'core',
            icon: data.icon || '✨',
            featured: data.featured === true,
            order: Number(data.order) || 0,
            image: data.image || '',
          }],
          updatedAt: new Date(),
        };

    if ('basePrice' in update && (!data.name || !Number.isFinite(Number(data.basePrice)))) {
      return NextResponse.json({ success: false, error: 'Service name and valid price are required' }, { status: 400 });
    }

    const [service] = await db.update(services).set(update).where(eq(services.id, data.id)).returning();

    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ success: true, service: toServiceView(service) });
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Service id is required' }, { status: 400 });
    const [service] = await db.update(services).set({ isActive: false, updatedAt: new Date() }).where(eq(services.id, id)).returning();
    if (!service) return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to deactivate service:', error);
    return NextResponse.json({ success: false, error: 'Failed to deactivate service' }, { status: 500 });
  }
}
