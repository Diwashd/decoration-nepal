import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, eventTypes, leads, auditLogs } from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { generateEventId } from '@/lib/utils';

interface PlannerSubmission {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventTypeId: string;
  eventTypeName?: string;
  eventDates?: string[];
  eventDate?: string;
  budgetRange?: string;
  venue?: string;
  venueAddress?: string;
  startTime?: string;
  endTime?: string;
  guestCount?: string;
  specialRequests?: string;
  themeName?: string;
  colorPaletteName?: string;
  selectedComponents?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as PlannerSubmission;

    const eventDates = Array.isArray(data.eventDates)
      ? data.eventDates.filter((date: unknown): date is string => typeof date === 'string' && date.length > 0)
      : data.eventDate
        ? [data.eventDate]
        : [];

    // Validate required fields
    if (!data.customerName || !data.customerEmail || !data.customerPhone || !data.eventTypeId || eventDates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const eventType = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.eventTypeId)
      ? await db.query.eventTypes.findFirst({ where: eq(eventTypes.id, data.eventTypeId) })
      : await db.query.eventTypes.findFirst({ where: eq(eventTypes.slug, data.eventTypeId) });

    if (!eventType) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid event type.' },
        { status: 400 }
      );
    }

    // Check if customer exists by email or phone
    let customer = await db.query.customers.findFirst({
      where: or(
        eq(customers.email, data.customerEmail),
        eq(customers.phone, data.customerPhone),
      ),
    });

    // Create customer if doesn't exist
    if (!customer) {
      const [newCustomer] = await db.insert(customers).values({
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone,
        address: data.venueAddress || null,
        notes: data.specialRequests || null,
      }).returning();

      customer = newCustomer;
    }

    // Create lead
    const eventId = generateEventId();

    const [lead] = await db.insert(leads).values({
      customerId: customer.id,
      source: 'Website',
      eventTypeId: eventType.id,
      eventDate: eventDates[0],
      budgetRange: data.budgetRange || null,
      venue: data.venue,
      status: 'new',
      notes: buildLeadNotes(data),
      specialRequests: data.specialRequests || null,
    }).returning();

    // Log the lead creation
    await db.insert(auditLogs).values({
      userId: null, // System-generated
      action: 'LEAD_CREATED',
      tableName: 'leads',
      recordId: lead.id,
      newValue: { eventId, source: 'Website Event Planner' },
    });

    return NextResponse.json({
      success: true,
      eventId,
      leadId: lead.id,
      message: 'Your request has been submitted successfully!',
    });
  } catch (error) {
    console.error('Failed to submit event request:', error);
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Failed to submit request. Please try again.',
      },
      { status: 500 }
    );
  }
}

function buildLeadNotes(data: PlannerSubmission): string {
  const notes = [];
  const eventDates = Array.isArray(data.eventDates) && data.eventDates.length > 0
    ? data.eventDates
    : data.eventDate
      ? [data.eventDate]
      : [];

  notes.push(`Event Planner Submission`);
  notes.push(`Event Type: ${data.eventTypeName || 'Not specified'}`);
  notes.push(`Preferred Dates: ${eventDates.join(', ')}`);

  if (data.startTime) notes.push(`Time: ${data.startTime} - ${data.endTime || 'TBD'}`);
  if (data.venue) notes.push(`Venue: ${data.venue}`);
  if (data.venueAddress) notes.push(`Address: ${data.venueAddress}`);
  if (data.guestCount) notes.push(`Guests: ${data.guestCount}`);
  if (data.budgetRange) notes.push(`Budget: ${data.budgetRange}`);

  if (data.themeName) notes.push(`Theme: ${data.themeName}`);
  if (data.colorPaletteName) notes.push(`Colors: ${data.colorPaletteName}`);

  if (data.selectedComponents && data.selectedComponents.length > 0) {
    notes.push(`Components: ${data.selectedComponents.join(', ')}`);
  }

  return notes.join('\n');
}
