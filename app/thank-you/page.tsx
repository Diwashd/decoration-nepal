'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomerLayout from '@/components/customer/CustomerLayout';
import Link from 'next/link';
import { getPlannerCompletedWhatsAppMessage, getWhatsAppLink } from '@/lib/utils';
import { CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || undefined;
  const queryMessage = searchParams.get('whatsapp');
  const [whatsappMessage, setWhatsappMessage] = useState(
    queryMessage || getPlannerCompletedWhatsAppMessage({ eventId }),
  );

  useEffect(() => {
    const storedMessage = window.sessionStorage.getItem('planner-whatsapp-message');
    if (storedMessage) {
      setWhatsappMessage(storedMessage);
      window.sessionStorage.removeItem('planner-whatsapp-message');
    }
  }, []);

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-6 rounded-full">
              <CheckCircle className="w-20 h-20 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-cream-contrast">
              Request Submitted Successfully!
            </h1>
            <p className="text-xl text-on-surface-variant">
              Thank you for choosing <span className="text-primary font-semibold">11:11 Decoration Nepal</span>
            </p>
          </div>

          {eventId && (
            <div className="bg-surface-container border border-outline-variant rounded p-6 inline-block">
              <p className="text-sm text-on-surface-variant mb-1">Your Reference ID</p>
              <p className="text-2xl font-bold text-cream-contrast font-mono">{eventId}</p>
            </div>
          )}

          <div className="bg-surface-container border border-outline-variant rounded p-6 text-left space-y-3">
            <h3 className="font-semibold text-cream-contrast text-lg font-display">What happens next?</h3>
            <ul className="space-y-2 text-on-surface-variant">
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>Our team will review your requirements within <strong>24 hours</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>We&apos;ll prepare a detailed quotation tailored to your event</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>You&apos;ll receive a call or email to discuss specifics</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">✓</span>
                <span>We&apos;ll finalize the decoration plan and confirm your booking</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 pt-4">
            <p className="text-on-surface-variant">Need immediate assistance?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+9779847411305"
                className="inline-flex items-center justify-center space-x-2 bg-primary text-surface px-6 py-3 rounded-sm hover:bg-primary/90 transition font-semibold text-sm tracking-wide cursor-pointer"
              >
                <Phone className="w-5 h-5" />
                <span>Call Us Now</span>
              </a>
              <a
                href={getWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 border border-primary text-primary px-6 py-3 rounded-sm hover:bg-primary/10 transition font-semibold text-sm tracking-wide cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                <span>Send Planner Request on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary-container font-semibold text-sm tracking-wide"
            >
              <span>Return to Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8 text-sm text-on-surface-variant">
            <p>We&apos;ve sent a confirmation email to your inbox.</p>
            <p>Please check your spam folder if you don&apos;t see it.</p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <CustomerLayout>
          <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
            <p className="text-on-surface-variant">Loading confirmation...</p>
          </div>
        </CustomerLayout>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
