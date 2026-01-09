import { redirect } from 'next/navigation';
import { checkAdmin } from '@/lib/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    redirect('/');
  }

  return <AdminDashboard />;
}