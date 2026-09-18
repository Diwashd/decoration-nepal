import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments, events, customers } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const records = await db
      .select({
        id: payments.id,
        eventId: payments.eventId,
        amount: payments.amount,
        paymentDate: payments.paymentDate,
        paymentMethod: payments.paymentMethod,
        transactionReference: payments.transactionReference,
        status: payments.status,
        notes: payments.notes,
        createdAt: payments.createdAt,
        eventName: events.name,
        customerName: customers.name,
        quotationNumber: sql<string>`(SELECT quotation_number FROM ${sql.raw('quotations')} WHERE id = ${events.quotationId})`.as('quotationNumber'),
      })
      .from(payments)
      .leftJoin(events, eq(payments.eventId, events.id))
      .leftJoin(customers, eq(events.customerId, customers.id))
      .orderBy(desc(payments.paymentDate));

    return NextResponse.json({ success: true, payments: records });
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    if (!data.eventId || !data.amount || !data.paymentDate || !data.paymentMethod) {
      return NextResponse.json({ success: false, error: 'Event, amount, date, and method are required' }, { status: 400 });
    }

    const [payment] = await db.insert(payments).values({
      eventId: data.eventId,
      amount: Number(data.amount),
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      transactionReference: data.transactionReference || null,
      notes: data.notes || null,
      status: data.status || 'completed',
    }).returning();

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ success: false, error: 'Payment ID is required' }, { status: 400 });
    }

    const [payment] = await db
      .update(payments)
      .set({
        amount: data.amount !== undefined ? Number(data.amount) : undefined,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
        status: data.status,
        notes: data.notes,
      })
      .where(eq(payments.id, data.id))
      .returning();

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error) {
    console.error('Failed to update payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Payment ID is required' }, { status: 400 });

    await db.delete(payments).where(eq(payments.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete payment:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete payment' }, { status: 500 });
  }
}
