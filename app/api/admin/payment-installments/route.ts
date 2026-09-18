import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { paymentInstallments, events, customers } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const eventId = request.nextUrl.searchParams.get('eventId');

    if (eventId) {
      // Get installments for a specific event
      const records = await db
        .select()
        .from(paymentInstallments)
        .where(eq(paymentInstallments.eventId, eventId))
        .orderBy(paymentInstallments.installmentNumber);

      return NextResponse.json({ success: true, installments: records });
    }

    // Get all installments with event and customer details
    const records = await db
      .select({
        id: paymentInstallments.id,
        eventId: paymentInstallments.eventId,
        installmentType: paymentInstallments.installmentType,
        installmentNumber: paymentInstallments.installmentNumber,
        amount: paymentInstallments.amount,
        dueDate: paymentInstallments.dueDate,
        paymentDate: paymentInstallments.paymentDate,
        paymentMethod: paymentInstallments.paymentMethod,
        transactionReference: paymentInstallments.transactionReference,
        status: paymentInstallments.status,
        notes: paymentInstallments.notes,
        createdAt: paymentInstallments.createdAt,
        eventName: events.name,
        customerName: customers.name,
        quotationNumber: sql<string>`(SELECT quotation_number FROM quotations WHERE id = ${events.quotationId})`.as('quotationNumber'),
      })
      .from(paymentInstallments)
      .leftJoin(events, eq(paymentInstallments.eventId, events.id))
      .leftJoin(customers, eq(events.customerId, customers.id))
      .orderBy(desc(paymentInstallments.createdAt));

    return NextResponse.json({ success: true, installments: records });
  } catch (error) {
    console.error('Failed to fetch installments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch installments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    if (!data.eventId || !data.amount || !data.installmentType) {
      return NextResponse.json({ success: false, error: 'Event ID, amount, and type are required' }, { status: 400 });
    }

    const [installment] = await db.insert(paymentInstallments).values({
      eventId: data.eventId,
      installmentType: data.installmentType,
      installmentNumber: data.installmentNumber || 1,
      amount: Number(data.amount),
      dueDate: data.dueDate || null,
      paymentDate: data.paymentDate || null,
      paymentMethod: data.paymentMethod || null,
      transactionReference: data.transactionReference || null,
      status: data.status || 'pending',
      notes: data.notes || null,
    }).returning();

    return NextResponse.json({ success: true, installment });
  } catch (error) {
    console.error('Failed to create installment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create installment' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Installment ID is required' }, { status: 400 });
    }

    const [installment] = await db
      .update(paymentInstallments)
      .set({
        amount: data.amount !== undefined ? Number(data.amount) : undefined,
        dueDate: data.dueDate,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        status: data.status,
        notes: data.notes,
        updatedAt: new Date(),
      })
      .where(eq(paymentInstallments.id, data.id))
      .returning();

    if (!installment) {
      return NextResponse.json({ success: false, error: 'Installment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, installment });
  } catch (error) {
    console.error('Failed to update installment:', error);
    return NextResponse.json({ success: false, error: 'Failed to update installment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Installment ID is required' }, { status: 400 });

    await db.delete(paymentInstallments).where(eq(paymentInstallments.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete installment:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete installment' }, { status: 500 });
  }
}
