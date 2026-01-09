import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import AdminHeader from './AdminHeader';
import PendingCompanies from './PendingCompanies';
import AdminStats from './AdminStats';
import GlobalMetrics from './GlobalMetrics';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return null;
  }

  // Get pending companies
  const { data: pendingCompanies } = await supabase
    .from('companies')
    .select(`
      *,
      profiles (
        id,
        email,
        full_name,
        phone,
        created_at
      )
    `)
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true });

  // Get all companies for stats
  const { data: allCompanies } = await supabase
    .from('companies')
    .select('verification_status');

  // Get all jobs
  const { data: allJobs } = await supabase
    .from('jobs')
    .select('status');

  // Get all applications
  const { data: allApplications } = await supabase
    .from('applications')
    .select('status');

  // Get all profiles for user counts
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('role');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <AdminStats 
          companies={allCompanies || []}
          jobs={allJobs || []}
          applications={allApplications || []}
          profiles={allProfiles || []}
        />

        {/* Pending Companies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Verifications</h2>
          <PendingCompanies companies={pendingCompanies || []} />
        </div>

        {/* Global Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Metrics</h2>
          <GlobalMetrics 
            companies={allCompanies || []}
            jobs={allJobs || []}
            applications={allApplications || []}
          />
        </div>
      </main>
    </div>
  );
}