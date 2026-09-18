import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotations, quotationItems, auditLogs, leads, events, payments, paymentInstallments } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { hasPermission } from '@/lib/services/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !hasPermission(user.role, 'quotes.create')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.leadId || !data.customerId || !data.items || data.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the lead to generate quotation number
    const lead = await db.query.leads.findFirst({
      where: eq(leads.id, data.leadId),
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Generate quotation number: QT-YYYY-NNNN
    const year = new Date().getFullYear();
    const existingQuotes = await db.query.quotations.findMany({
      where: (quotations, { and, like }) =>
        and(like(quotations.quotationNumber, `QT-${year}-%`)),
    });
    const quoteNumber = `QT-${year}-${String(existingQuotes.length + 1).padStart(4, '0')}`;

    // Calculate valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + (data.validityDays || 30));

    // Create quotation
    const [newQuotation] = await db
      .insert(quotations)
      .values({
        leadId: data.leadId,
        quotationNumber: quoteNumber,
        version: 1,
        customerId: data.customerId,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount || 0,
        transportationCost: data.transportationCost || 0,
        taxAmount: data.taxAmount || 0,
        totalAmount: data.grandTotal,
        advanceRequired: data.advanceRequired || 0,
        termsAndConditions: data.termsAndConditions || null,
        validUntil: validUntil.toISOString().split('T')[0],
        status: data.status || 'draft',
        createdById: user.id,
      })
      .returning();

    // Create quotation items
    const itemsToInsert = data.items.map((item: any) => ({
      quotationId: newQuotation.id,
      serviceId: item.serviceId || null,
      name: item.name,
      description: item.description || null,
      quantity: item.quantity,
      unit: item.unit || 'item',
      unitPrice: item.unitPrice,
      costPrice: 0, // Can be set later for profit tracking
      totalPrice: item.totalPrice,
      isCustom: item.isCustom || false,
    }));

    await db.insert(quotationItems).values(itemsToInsert);

    // Create an automatic event for this quotation
    const eventNumber = `EVT-${year}-${String(existingQuotes.length + 1).padStart(4, '0')}`;
    const [newEvent] = await db
      .insert(events)
      .values({
        eventId: eventNumber,
        leadId: data.leadId,
        quotationId: newQuotation.id,
        customerId: data.customerId,
        name: lead.eventTypeId ? `Event for ${quoteNumber}` : `Event for ${quoteNumber}`,
        eventTypeId: lead.eventTypeId,
        eventDate: lead.eventDate,
        venue: lead.venue || 'TBD',
        status: 'inquiry',
      })
      .returning();

    // Create first installment (advance payment - 50%)
    const advanceAmount = data.advanceRequired || (data.grandTotal * 0.5);
    await db.insert(paymentInstallments).values({
      eventId: newEvent.id,
      installmentType: 'advance',
      installmentNumber: 1,
      amount: advanceAmount,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes: `Installment 1 - Advance payment for quotation ${quoteNumber}`,
    });

    // Update lead status to 'quoted' if not already
    if (lead.status === 'new' || lead.status === 'contacted') {
      await db
        .update(leads)
        .set({
          status: 'quoted',
          lastContactDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, data.leadId));
    }

    // Log the creation
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'QUOTATION_CREATED',
      tableName: 'quotations',
      recordId: newQuotation.id,
      newValue: {
        quotationNumber: quoteNumber,
        totalAmount: data.grandTotal,
        status: data.status,
      },
    });

    return NextResponse.json({
      success: true,
      quotation: newQuotation,
      event: newEvent,
      emailSent: false,
      message: data.status === 'sent'
        ? 'Quotation created successfully. Marked as sent.'
        : 'Quotation saved as draft.',
    });
  } catch (error) {
    console.error('Failed to create quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create quotation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !hasPermission(user.role, 'quotes.view')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const allQuotations = await db.query.quotations.findMany({
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
      orderBy: (quotations, { desc }) => [desc(quotations.createdAt)],
    });

    return NextResponse.json({
      success: true,
      quotations: allQuotations,
    });
  } catch (error) {
    console.error('Failed to fetch quotations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}
