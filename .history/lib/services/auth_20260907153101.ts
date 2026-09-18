import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string | null;
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  credentials: LoginCredentials
): Promise<AuthUser | null> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, credentials.email),
    });

    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

/**
 * Hash password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin or super admin
 */
export function isAdmin(userRole: string): boolean {
  return ['super_admin', 'admin'].includes(userRole);
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    super_admin: ['*'], // All permissions
    admin: [
      'events.view',
      'events.create',
      'events.edit',
      'events.delete',
      'leads.view',
      'leads.create',
      'leads.edit',
      'quotes.view',
      'quotes.create',
      'quotes.edit',
      'quotes.approve',
      'customers.view',
      'customers.edit',
      'inventory.view',
      'inventory.edit',
      'payments.view',
      'payments.create',
      'staff.view',
      'staff.assign',
      'vendors.view',
      'vendors.edit',
      'reports.view',
    ],
    sales_manager: [
      'leads.view',
      'leads.create',
      'leads.edit',
      'quotes.view',
      'quotes.create',
      'quotes.edit',
      'customers.view',
      'customers.edit',
      'events.view',
      'reports.view',
    ],
    event_coordinator: [
      'events.view',
      'events.edit',
      'inventory.view',
      'staff.view',
      'vendors.view',
      'customers.view',
    ],
    inventory_manager: [
      'inventory.view',
      'inventory.create',
      'inventory.edit',
      'inventory.delete',
      'events.view',
    ],
    finance: [
      'payments.view',
      'payments.create',
      'payments.verify',
      'expenses.view',
      'expenses.create',
      'reports.view',
      'events.view',
    ],
    staff: ['events.view'],
  };

  return permissions[role] || [];
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userRole: string, permission: string): boolean {
  const permissions = getUserPermissions(userRole);
  return permissions.includes('*') || permissions.includes(permission);
}
