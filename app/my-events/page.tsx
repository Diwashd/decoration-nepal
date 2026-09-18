import CustomerLayout from '@/components/customer/CustomerLayout';
import Link from 'next/link';
import { Search, Calendar, Package, AlertCircle } from 'lucide-react';

export default function MyEventsPage() {
  return (
    <CustomerLayout>
      <div className="min-h-screen bg-surface py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-cream-contrast mb-3">My Events</h1>
            <p className="text-on-surface-variant">Track your decoration requests and bookings</p>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded p-8">
            <div className="text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-cream-contrast font-display">Find Your Event Request</h2>
              <p className="text-on-surface-variant max-w-md mx-auto">
                Enter your email or phone number to view your event requests and quotations
              </p>

              <form className="max-w-md mx-auto space-y-4 pt-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter your email or phone number"
                    className="w-full px-4 py-3 bg-surface-container-high border-b border-outline focus:border-primary text-cream-contrast rounded-sm focus:outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-surface px-6 py-3 rounded-sm hover:bg-primary/90 transition font-semibold text-sm tracking-wide"
                >
                  Search My Events
                </button>
              </form>

              <div className="pt-8 text-sm text-on-surface-variant">
                <p>Don&apos;t have an event request yet?</p>
                <Link href="/planner" className="text-primary hover:text-primary-container font-semibold text-sm tracking-wide">
                  Start Planning Your Event →
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container border border-outline-variant p-6 rounded text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-cream-contrast mb-2 font-display">Easy Tracking</h3>
              <p className="text-sm text-on-surface-variant">Monitor your event status in real-time</p>
            </div>
            <div className="bg-surface-container border border-outline-variant p-6 rounded text-center">
              <Package className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-cream-contrast mb-2 font-display">View Quotations</h3>
              <p className="text-sm text-on-surface-variant">Access detailed quotations and pricing</p>
            </div>
            <div className="bg-surface-container border border-outline-variant p-6 rounded text-center">
              <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-cream-contrast mb-2 font-display">Get Updates</h3>
              <p className="text-sm text-on-surface-variant">Receive notifications about your booking</p>
            </div>
          </div>

          <div className="mt-8 bg-surface-container border border-outline-variant rounded p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-champagne-gold flex-shrink-0 mt-0.5" />
              <div className="text-sm text-on-surface-variant">
                <p className="font-semibold mb-1 text-cream-contrast">Customer Portal Coming Soon!</p>
                <p>We&apos;re building a full customer dashboard where you&apos;ll be able to login, view all your events, make payments, and communicate with our team directly. For now, please contact us at <strong className="text-primary">+977-9847411305</strong> for status updates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
