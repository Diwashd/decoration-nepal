import { requireAuth } from '@/lib/services/session';
import DestinationForm from '@/components/admin/DestinationForm';

export default async function NewDestinationPage() {
  await requireAuth();
  return <DestinationForm />;
}
