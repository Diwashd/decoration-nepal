import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events, auditLogs, leads } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { hasPermission } from '@/lib/services/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !hasPermission(user.role, 'events.create')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.quotationId || !data.leadId || !data.customerId || !data.eventTypeId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate event ID: EVT-YYYY-NNNN
    const year = new Date().getFullYear();
    const existingEvents = await db.query.events.findMany({
      where: (events, { and, like }) => and(like(events.eventId, `EVT-${year}-%`)),
    });
    const eventId = `EVT-${year}-${String(existingEvents.length + 1).padStart(4, '0')}`;

    // Create event
    const [newEvent] = await db
      .insert(events)
      .values({
        eventId,
        leadId: data.leadId,
        quotationId: data.quotationId,
        customerId: data.customerId,
        name: data.name,
        eventTypeId: data.eventTypeId,
        eventDate: data.eventDate,
        startTime: data.startTime || null,
        endTime: data.endTime || null,
        venue: data.venue,
        venueAddress: data.venueAddress || null,
        guestCount: data.guestCount || null,
        themeId: data.themeId || null,
        colorPaletteId: data.colorPaletteId || null,
        specialInstructions: data.specialInstructions || null,
        status: 'confirmed',
        coordinatorId: data.coordinatorId || null,
      })
      .returning();

    // Update lead status to 'won'
    await db
      .update(leads)
      .set({
        status: 'won',
        updatedAt: new Date(),
      })
      .where(eq(leads.id, data.leadId));

    // Log the creation
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'EVENT_CREATED',
      tableName: 'events',
      recordId: newEvent.id,
      newValue: {
        eventId,
        name: newEvent.name,
        eventDate: newEvent.eventDate,
        status: newEvent.status,
      },
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !hasPermission(user.role, 'events.view')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const allEvents = await db.query.events.findMany({
      with: {
        customer: true,
        eventType: true,
        coordinator: true,
        quotation: true,
        lead: true,
      },
      orderBy: (events, { desc }) => [desc(events.eventDate)],
    });

    return NextResponse.json({
      success: true,
      events: allEvents,
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
