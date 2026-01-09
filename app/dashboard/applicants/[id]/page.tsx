import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import ApplicantDetail from '@/components/applicants/ApplicantDetail';

interface ApplicantDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { user, profile } = await requireRole(['company']);
  const data = await getCompanyData();

  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard');
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Get application with full details
  const { data: application } = await supabase
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
        resume_url,
        student_id_doc_url
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
    .eq('id', params.id)
    .single();

  if (!application) {
    redirect('/dashboard/applicants');
  }

  // Verify this application belongs to company's job
   const job = (application as any).jobs;

  if (job.company_id !== data.company.id) {
    redirect('/dashboard/applicants');
  }

  // Get student profile
  const student = (application as any).students;
//  const student = application.students as any;
  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', student.profile_id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicantDetail
          application={application}
          studentProfile={studentProfile}
          companyId={data.company.id}
        />
      </main>
    </div>
  );
}