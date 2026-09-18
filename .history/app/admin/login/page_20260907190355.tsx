'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '@/app/actions/auth';
import { ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await loginAction({ email, password });
        if (result.success) {
          setSuccess('Access granted! Redirecting...');
          setTimeout(() => {
            router.push(redirect);
            router.refresh();
          }, 1500);
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md space-y-8 bg-surface-container p-8 rounded border border-outline-variant">
        <div className="text-center space-y-2">
          <span className="text-3xl font-extrabold font-display text-primary block">11:11</span>
          <h2 className="text-2xl font-bold font-display text-cream-contrast">Admin Panel Login</h2>
          <p className="text-sm text-on-surface-variant">Enterprise Event & Decoration Console</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-surface-container-high text-primary p-3 rounded border border-primary/30 text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 bg-surface-container-high text-primary p-3 rounded border border-primary/30 text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant mb-1">Email Address</label>
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="admin@decorationnepal.com" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant mb-1">Password</label>
              <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-surface border-b border-outline focus:border-primary focus:outline-none text-on-surface transition" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isPending} className="group flex w-full justify-center items-center space-x-2 rounded bg-primary px-4 py-3 text-sm font-bold text-surface hover:bg-primary-container disabled:bg-surface-container-high transition">
            <span>{isPending ? 'Authenticating...' : 'Sign In'}</span>
            {!isPending && <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface px-4">
          <p className="text-on-surface-variant">Loading login...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
