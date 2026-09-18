import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eventTypes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const eventTypesData = await db.query.eventTypes.findMany({
      where: eq(eventTypes.isActive, true),
      orderBy: (eventTypes, { asc }) => [asc(eventTypes.name)],
    });

    return NextResponse.json({
      eventTypes: eventTypesData,
    });
  } catch (error) {
    console.error('Failed to fetch planner data:', error);
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Failed to load planner data',
      },
      { status: 500 }
    );
  }
}
