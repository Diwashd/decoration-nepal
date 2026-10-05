import { requireAuth } from '@/lib/services/session';
import ServiceForm from '@/components/admin/ServiceForm';

export default async function NewServicePage() {
  await requireAuth();
  return <ServiceForm />;
}
