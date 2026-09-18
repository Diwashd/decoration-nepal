import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { destinations } from '@/lib/db/schema';
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const records = await db.query.destinations.findMany({
      where: eq(destinations.isActive, true),
      orderBy: [asc(destinations.sortOrder), asc(destinations.name)],
    });
    return NextResponse.json({ destinations: records.map(destination => ({ ...destination, active: destination.isActive, amenities: Array.isArray(destination.amenities) ? destination.amenities : [] })) });
  } catch (error) {
    console.error('Failed to fetch public destinations:', error);
    return NextResponse.json({ error: 'Failed to load destinations' }, { status: 500 });
  }
}
