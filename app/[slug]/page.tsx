import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CustomerLayout from '@/components/customer/CustomerLayout';
import { Sparkles } from 'lucide-react';

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const fallbackTitle = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <CustomerLayout>
      <section className="bg-gradient-to-b from-surface-container to-surface py-24 border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 border border-primary-container/30 rounded-full text-primary text-xs font-medium tracking-widest uppercase">
            Eleven Eleven
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cream-contrast">{fallbackTitle}</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-body">
            Professional decoration services for your special event in Nepal.
          </p>
          <div className="pt-4">
            <Link href="/planner" className="inline-block bg-primary text-surface px-8 py-3 rounded-sm hover:bg-primary/90 transition font-semibold text-sm tracking-wide">
              Configure Live Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-cream-contrast text-center mb-12">Available Packages</h2>
          <div className="text-center py-16 border border-dashed border-outline-variant rounded bg-surface-container">
            <Sparkles className="w-8 h-8 text-outline mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">Packages will appear here after database setup</p>
            <Link href="/planner" className="inline-block mt-4 text-primary hover:text-primary-container font-semibold text-sm tracking-wide">
              Design custom setup now &rarr;
            </Link>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
