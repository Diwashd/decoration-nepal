'use client';

import { FormEvent, useEffect, useState } from 'react';
import { KeyRound, UserPlus, Users } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  isActive: boolean;
};

const roleOptions = ['super_admin', 'admin', 'sales_manager', 'event_coordinator', 'inventory_manager', 'finance', 'staff'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff', phoneNumber: '' });
  const [resetId, setResetId] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    const response = await fetch('/api/admin/users', { cache: 'no-store' });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Failed to load users');
    setUsers(result.users);
  };

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/admin/users', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Failed to load users');
        if (!cancelled) setUsers(result.users);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Failed to load users');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const response = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to create user');
      return;
    }
    setForm({ name: '', email: '', password: '', role: 'staff', phoneNumber: '' });
    setMessage('User created successfully.');
    await loadUsers();
  };

  const reset = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');
    const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset-password', id: resetId, password: resetPassword }) });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to reset password');
      return;
    }
    setResetId('');
    setResetPassword('');
    setMessage('Password reset successfully.');
  };

  const toggleActive = async (user: User) => {
    setError('');
    const response = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id, isActive: !user.isActive }) });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setError(result.error || 'Failed to update user');
      return;
    }
    setUsers((current) => current.map((item) => item.id === user.id ? result.user : item));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-cream-contrast"><Users className="h-7 w-7 text-primary" /> User Management</h1>
        <p className="mt-1 text-on-surface-variant">Create admin accounts and reset user passwords securely.</p>
      </div>
      {message && <p className="rounded border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary" role="status">{message}</p>}
      {error && <p className="rounded border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-outline-variant bg-surface-container p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-cream-contrast"><UserPlus className="h-5 w-5 text-primary" /> Create user</h2>
          {[
            ['name', 'Full name', 'text'],
            ['email', 'Email address', 'email'],
            ['phoneNumber', 'Phone number', 'tel'],
            ['password', 'Temporary password (8+ characters)', 'password'],
          ].map(([key, label, type]) => (
            <label key={key} className="block text-sm text-on-surface-variant">{label}
              <input required={key !== 'phoneNumber'} type={type} value={form[key as keyof typeof form]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="mt-1 w-full rounded border-b border-outline bg-surface-container-high px-3 py-2.5 text-on-surface focus:border-primary focus:outline-none" />
            </label>
          ))}
          <label className="block text-sm text-on-surface-variant">Role
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="mt-1 w-full rounded border-b border-outline bg-surface-container-high px-3 py-2.5 text-on-surface focus:border-primary focus:outline-none">
              {roleOptions.map((role) => <option key={role} value={role}>{role.replaceAll('_', ' ')}</option>)}
            </select>
          </label>
          <button type="submit" className="rounded bg-primary px-4 py-2.5 font-semibold text-on-primary transition hover:bg-primary-fixed hover:shadow-lg hover:shadow-primary/20">Create user</button>
        </form>

        <form onSubmit={reset} className="space-y-4 rounded-xl border border-outline-variant bg-surface-container p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-cream-contrast"><KeyRound className="h-5 w-5 text-primary" /> Reset password</h2>
          <label className="block text-sm text-on-surface-variant">User
            <select required value={resetId} onChange={(event) => setResetId(event.target.value)} className="mt-1 w-full rounded border-b border-outline bg-surface-container-high px-3 py-2.5 text-on-surface focus:border-primary focus:outline-none">
              <option value="">Select a user</option>
              {users.map((user) => <option key={user.id} value={user.id}>{user.name} — {user.email}</option>)}
            </select>
          </label>
          <label className="block text-sm text-on-surface-variant">New password (8+ characters)
            <input required minLength={8} type="password" value={resetPassword} onChange={(event) => setResetPassword(event.target.value)} className="mt-1 w-full rounded border-b border-outline bg-surface-container-high px-3 py-2.5 text-on-surface focus:border-primary focus:outline-none" />
          </label>
          <button type="submit" className="rounded border border-primary px-4 py-2.5 font-semibold text-primary transition hover:bg-primary/10">Reset password</button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface-variant"><tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user.id} className="border-b border-outline-variant/60 last:border-0"><td className="px-5 py-4"><div className="font-semibold text-cream-contrast">{user.name}</div><div className="text-on-surface-variant">{user.email}</div></td><td className="px-5 py-4 text-on-surface-variant">{user.role.replaceAll('_', ' ')}</td><td className="px-5 py-4"><span className={user.isActive ? 'text-emerald-300' : 'text-red-300'}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td className="px-5 py-4 text-right"><button type="button" onClick={() => void toggleActive(user)} className="text-primary hover:text-primary-fixed">{user.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
