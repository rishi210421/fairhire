import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import CompanyAnalytics from '@/components/analytics/CompanyAnalytics';

export default async function AnalyticsPage() {
  const { user, profile } = await requireRole(['company']);

  if (profile.role !== 'company') {
    redirect('/dashboard');
  }

  const data = await getCompanyData();

  // Check if company is verified
  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard');
  }

  // Get applications with full details for analytics
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        skills_required
      ),
      students (
        id,
        education,
        skills
      )
    `)
    .in('job_id', data.jobs.map(j => j.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600 mt-2">View bias insights and conversion metrics</p>
        </div>
        <CompanyAnalytics jobs={data.jobs} applications={applications || []} />
      </main>
    </div>
  );
}