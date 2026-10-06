import { NextRequest, NextResponse } from 'next/server';
import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/services/session';
import { hashPassword, isAdmin } from '@/lib/services/auth';

const roles = ['super_admin', 'admin', 'sales_manager', 'event_coordinator', 'inventory_manager', 'finance', 'staff'] as const;
const userSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  role: z.enum(roles),
  phoneNumber: z.string().trim().max(50).optional(),
});
const passwordSchema = z.object({ password: z.string().min(8).max(128) });

async function requireAdmin() {
  const session = await getSession();
  if (!session || !isAdmin(session.role)) return null;
  return session;
}

function toUserView(user: typeof users.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

function getDatabaseErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
  }
  return null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const records = await db.select().from(users).orderBy(asc(users.name));
  return NextResponse.json({ success: true, users: records.map(toUserView) });
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const data = userSchema.parse(await request.json());
    const [user] = await db.insert(users).values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      role: data.role,
      phoneNumber: data.phoneNumber || null,
      isActive: true,
    }).returning();
    return NextResponse.json({ success: true, user: toUserView(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid user details' }, { status: 400 });
    }
    if (getDatabaseErrorCode(error) === '23505' || (error instanceof Error && error.message.toLowerCase().includes('unique'))) {
      return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
    }
    if (getDatabaseErrorCode(error) === '42P01') {
      return NextResponse.json({ success: false, error: 'The users table is missing. Run the database schema setup first.' }, { status: 500 });
    }
    console.error('Failed to create admin user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (body.action === 'reset-password') {
      const { password } = passwordSchema.parse(body);
      if (!body.id || typeof body.id !== 'string') return NextResponse.json({ success: false, error: 'User id is required' }, { status: 400 });
      const [updated] = await db.update(users).set({ passwordHash: await hashPassword(password), updatedAt: new Date() }).where(eq(users.id, body.id)).returning();
      if (!updated) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (!body.id || typeof body.id !== 'string' || typeof body.isActive !== 'boolean') {
      return NextResponse.json({ success: false, error: 'User id and active status are required' }, { status: 400 });
    }
    if (body.id === session.id && body.isActive === false) {
      return NextResponse.json({ success: false, error: 'You cannot deactivate your own account' }, { status: 400 });
    }
    const [updated] = await db.update(users).set({ isActive: body.isActive, updatedAt: new Date() }).where(eq(users.id, body.id)).returning();
    if (!updated) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user: toUserView(updated) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid password' }, { status: 400 });
    }
    console.error('Failed to update admin user:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
