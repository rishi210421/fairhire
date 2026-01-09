import { createClient } from './supabase/server';
import { getProfile } from './auth';
import type { Company, Job, Application, Profile } from '@/types/database';

export async function getCompanyData() {
  const supabase = await createClient();
  const profile = await getProfile();

  if (!profile || profile.role !== 'company') {
    throw new Error('Not a company');
  }

  // Get company record
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('profile_id', profile.id)
    .single();

  if (!company) {
    throw new Error('Company record not found');
  }

  // Get company jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  // Get applications for company jobs
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
        skills
      )
    `)
    .in('job_id', (jobs || []).map(j => j.id))
    .order('applied_at', { ascending: false });

  // Get student profiles for applications
  const studentProfileIds = (applications || [])
    .map((a: any) => a.students?.profile_id)
    .filter(Boolean);

  const { data: studentProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email')
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

  return {
    profile: profile as Profile,
    company: company as Company,
    jobs: (jobs || []) as Job[],
    applications: enrichedApplications as Application[],
  };
}
