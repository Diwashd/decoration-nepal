import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotations, auditLogs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/services/session';
import { hasPermission } from '@/lib/services/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    const { id } = await params;

    if (!user || !hasPermission(user.role, 'quotes.edit')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Get old quotation data for audit log
    const oldQuotation = await db.query.quotations.findFirst({
      where: eq(quotations.id, id),
    });

    if (!oldQuotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Update quotation
    const [updatedQuotation] = await db
      .update(quotations)
      .set({
        status: data.status ?? oldQuotation.status,
        ...(typeof data.whatsappSent === 'boolean'
          ? {
              whatsappSent: data.whatsappSent,
              whatsappSentAt: data.whatsappSent
                ? (oldQuotation.whatsappSentAt || new Date())
                : null,
            }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(quotations.id, id))
      .returning();

    // Log the update
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'QUOTATION_UPDATED',
      tableName: 'quotations',
      recordId: id,
      oldValue: {
        status: oldQuotation.status,
          whatsappSent: oldQuotation.whatsappSent,
      },
      newValue: {
        status: updatedQuotation.status,
          whatsappSent: updatedQuotation.whatsappSent,
      },
    });

    return NextResponse.json({
      success: true,
      quotation: updatedQuotation,
    });
  } catch (error) {
    console.error('Failed to update quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();
    const { id } = await params;

    if (!user || !hasPermission(user.role, 'quotes.delete')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const quotation = await db.query.quotations.findFirst({
      where: eq(quotations.id, id),
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: 'Quotation not found' },
        { status: 404 }
      );
    }

    // Delete quotation (cascade will delete items)
    await db.delete(quotations).where(eq(quotations.id, id));

    // Log the deletion
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'QUOTATION_DELETED',
      tableName: 'quotations',
      recordId: id,
      oldValue: {
        quotationNumber: quotation.quotationNumber,
        totalAmount: quotation.totalAmount,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Quotation deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete quotation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete quotation' },
      { status: 500 }
    );
  }
}
