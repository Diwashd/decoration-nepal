import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { packages, auditLogs } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { hasPermission } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !hasPermission(user.role, 'packages.create')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.eventTypeId || !data.basePrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create package
    const [newPackage] = await db.insert(packages).values({
      name: data.name,
      eventTypeId: data.eventTypeId,
      description: data.description || null,
      basePrice: data.basePrice,
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive ?? true,
      images: [],
    }).returning();

    // Log the creation
    await db.insert(auditLogs).values({
      userId: user.id,
      action: 'PACKAGE_CREATED',
      tableName: 'packages',
      recordId: newPackage.id,
      newValue: { name: newPackage.name, basePrice: newPackage.basePrice },
    });

    return NextResponse.json({
      success: true,
      package: newPackage,
    });
  } catch (error) {
    console.error('Failed to create package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const allPackages = await db.query.packages.findMany({
      with: {
        eventType: true,
        packageItems: {
          with: {
            service: true,
          },
        },
      },
      orderBy: (packages, { asc }) => [asc(packages.sortOrder), asc(packages.name)],
    });

    return NextResponse.json({
      success: true,
      packages: allPackages,
    });
  } catch (error) {
    console.error('Failed to fetch packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}
