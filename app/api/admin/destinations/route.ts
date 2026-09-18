import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auditLogs, destinations } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { asc, eq } from 'drizzle-orm';

const toView = (destination: typeof destinations.$inferSelect) => ({
  ...destination,
  active: destination.isActive,
  image: destination.image ?? '',
  contact: destination.contact ?? '',
  amenities: Array.isArray(destination.amenities) ? destination.amenities : [],
});

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const records = await db.query.destinations.findMany({ orderBy: [asc(destinations.sortOrder), asc(destinations.name)] });
    return NextResponse.json({ success: true, destinations: records.map(toView) });
  } catch (error) {
    console.error('Failed to fetch destinations:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await request.json();
    if (!data.name || !data.location || !data.type || !data.capacity || !data.priceRange || !data.description) {
      return NextResponse.json({ success: false, error: 'Name, location, type, capacity, price, and description are required' }, { status: 400 });
    }
    const [destination] = await db.insert(destinations).values({
      name: data.name,
      location: data.location,
      type: data.type,
      capacity: data.capacity,
      priceRange: data.priceRange,
      rating: Number(data.rating) || 0,
      description: data.description,
      amenities: Array.isArray(data.amenities) ? data.amenities : [],
      image: data.image || null,
      contact: data.contact || null,
      featured: data.featured === true,
      isActive: data.active !== false,
      sortOrder: Number(data.order) || 0,
    }).returning();
    await db.insert(auditLogs).values({ userId: user.id, action: 'DESTINATION_CREATED', tableName: 'destinations', recordId: destination.id, newValue: { name: destination.name } });
    return NextResponse.json({ success: true, destination: toView(destination) });
  } catch (error) {
    console.error('Failed to create destination:', error);
    return NextResponse.json({ success: false, error: 'Failed to create destination' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await request.json();
    if (!data.id) return NextResponse.json({ success: false, error: 'Destination id is required' }, { status: 400 });
    const existing = await db.query.destinations.findFirst({ where: eq(destinations.id, data.id) });
    if (!existing) return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 });
    const [destination] = await db.update(destinations).set({
      name: data.name ?? existing.name,
      location: data.location ?? existing.location,
      type: data.type ?? existing.type,
      capacity: data.capacity ?? existing.capacity,
      priceRange: data.priceRange ?? existing.priceRange,
      rating: data.rating ?? existing.rating,
      description: data.description ?? existing.description,
      amenities: Array.isArray(data.amenities) ? data.amenities : existing.amenities,
      image: data.image ?? existing.image,
      contact: data.contact ?? existing.contact,
      featured: data.featured ?? existing.featured,
      isActive: data.active ?? existing.isActive,
      sortOrder: data.order ?? existing.sortOrder,
      updatedAt: new Date(),
    }).where(eq(destinations.id, data.id)).returning();
    return NextResponse.json({ success: true, destination: toView(destination) });
  } catch (error) {
    console.error('Failed to update destination:', error);
    return NextResponse.json({ success: false, error: 'Failed to update destination' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Destination id is required' }, { status: 400 });
    const [destination] = await db.update(destinations).set({ isActive: false, updatedAt: new Date() }).where(eq(destinations.id, id)).returning();
    if (!destination) return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to deactivate destination:', error);
    return NextResponse.json({ success: false, error: 'Failed to deactivate destination' }, { status: 500 });
  }
}
