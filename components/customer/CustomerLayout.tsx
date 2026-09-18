import CustomerNav from '@/components/customer/CustomerNav';
import CustomerFooter from '@/components/customer/CustomerFooter';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomerNav />
      <div className="pt-20 bg-surface">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-3">
          <Breadcrumbs />
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
