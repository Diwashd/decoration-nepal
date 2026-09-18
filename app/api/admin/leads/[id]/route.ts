import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, auditLogs } from '@/lib/db/schema';
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

    if (!user || !hasPermission(user.role, 'leads.edit')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Get old lead data for audit log
    const oldLead = await db.query.leads.findFirst({
      where: eq(leads.id, id),
    });

    if (!oldLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update lead
    const [updatedLead] = await db
      .update(leads)
      .set({
        status: data.status ?? oldLead.status,
        assignedSalespersonId: data.assignedSalespersonId !== undefined
          ? data.assignedSalespersonId
          : oldLead.assignedSalespersonId,
        notes: data.notes !== undefined ? data.notes : oldLead.notes,
        nextFollowUpDate: data.nextFollowUpDate !== undefined
          ? (data.nextFollowUpDate ? new Date(data.nextFollowUpDate) : null)
          : oldLead.nextFollowUpDate,
        lastContactDate: data.status !== oldLead.status ? new Date() : oldLead.lastContactDate,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    // Log the update
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'LEAD_UPDATED',
      tableName: 'leads',
      recordId: id,
      oldValue: {
        status: oldLead.status,
        assignedSalespersonId: oldLead.assignedSalespersonId,
      },
      newValue: {
        status: updatedLead.status,
        assignedSalespersonId: updatedLead.assignedSalespersonId,
      },
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
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

    if (!user || !hasPermission(user.role, 'leads.delete')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const lead = await db.query.leads.findFirst({
      where: eq(leads.id, id),
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Delete lead
    await db.delete(leads).where(eq(leads.id, id));

    // Log the deletion
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'LEAD_DELETED',
      tableName: 'leads',
      recordId: id,
      oldValue: {
        status: lead.status,
        customerId: lead.customerId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
