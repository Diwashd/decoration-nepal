import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { packages, auditLogs } from '@/lib/db/schema';
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

    if (!user || !hasPermission(user.role, 'packages.edit')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Get old package data for audit log
    const oldPackage = await db.query.packages.findFirst({
      where: eq(packages.id, id),
    });

    if (!oldPackage) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Update package
    const [updatedPackage] = await db
      .update(packages)
      .set({
        name: data.name ?? oldPackage.name,
        eventTypeId: data.eventTypeId ?? oldPackage.eventTypeId,
        description: data.description !== undefined ? data.description : oldPackage.description,
        basePrice: data.basePrice ?? oldPackage.basePrice,
        sortOrder: data.sortOrder ?? oldPackage.sortOrder,
        isActive: data.isActive !== undefined ? data.isActive : oldPackage.isActive,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, id))
      .returning();

    // Log the update
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'PACKAGE_UPDATED',
      tableName: 'packages',
      recordId: id,
      oldValue: {
        name: oldPackage.name,
        basePrice: oldPackage.basePrice,
        isActive: oldPackage.isActive,
      },
      newValue: {
        name: updatedPackage.name,
        basePrice: updatedPackage.basePrice,
        isActive: updatedPackage.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      package: updatedPackage,
    });
  } catch (error) {
    console.error('Failed to update package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update package' },
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

    if (!user || !hasPermission(user.role, 'packages.delete')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, id),
    });

    if (!pkg) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Delete package
    await db.delete(packages).where(eq(packages.id, id));

    // Log the deletion
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'PACKAGE_DELETED',
      tableName: 'packages',
      recordId: id,
      oldValue: { name: pkg.name, basePrice: pkg.basePrice },
    });

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}
