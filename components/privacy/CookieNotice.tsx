'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'decoration-nepal-cookie-consent';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const saveConsent = (choice: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // The banner can still be dismissed when storage is unavailable.
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-change', { detail: choice }));
  };

  if (!visible) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-[100] rounded-2xl border border-outline-variant bg-surface-container p-5 shadow-2xl md:inset-x-auto md:right-6 md:max-w-md"
    >
      <h2 className="text-base font-semibold text-on-surface">We use cookies</h2>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
        We use essential cookies to keep the site working and optional analytics cookies to understand site usage. You can accept or decline optional cookies.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveConsent('accepted')}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:bg-primary-fixed"
        >
          Accept cookies
        </button>
        <button
          type="button"
          onClick={() => saveConsent('declined')}
          className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high"
        >
          Decline optional
        </button>
      </div>
    </aside>
  );
}
