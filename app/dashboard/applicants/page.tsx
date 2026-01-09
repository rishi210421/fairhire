import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import ApplicantPipeline from '@/components/applicants/ApplicantPipeline';

export default async function ApplicantsPage() {
  const { user, profile } = await requireRole(['company']);

  if (profile.role !== 'company') {
    redirect('/dashboard');
  }

  const data = await getCompanyData();

  // Check if company is verified
  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard');
  }

  // Get applications with full details
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        company_id
      ),
      students (
        id,
        profile_id,
        education,
        skills,
        resume_url
      ),
      interviews (
        id,
        round_number,
        scheduled_at,
        duration_minutes,
        meeting_link,
        notes
      ),
      feedback (
        id,
        selection_reasoning,
        general_feedback
      )
    `)
    .in('job_id', data.jobs.map(j => j.id))
    .order('applied_at', { ascending: false });

  // Get student profiles
  const studentProfileIds = (applications || [])
    .map((a: any) => a.students?.profile_id)
    .filter(Boolean);

  const { data: studentProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone')
    .in('id', studentProfileIds);

  // Enrich applications with student profiles
  const enrichedApplications = (applications || []).map((app: any) => {
    const studentProfile = studentProfiles?.find(
      p => p.id === app.students?.profile_id
    );
    return {
      ...app,
      student_profile: studentProfile,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Applicant Pipeline</h1>
          <p className="text-gray-600 mt-2">Manage your job applicants</p>
        </div>
        <ApplicantPipeline applications={enrichedApplications} jobs={data.jobs} />
      </main>
    </div>
  );
}