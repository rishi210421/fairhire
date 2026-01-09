import { createClient } from './supabase/server';
import { getProfile } from './auth';
import { calculateSkillMatch } from './utils';
import type { Job, Application, Student, Profile } from '@/types/database';

export async function getStudentData() {
  const supabase = await createClient();
  const profile = await getProfile();

  if (!profile || profile.role !== 'student') {
    throw new Error('Not a student');
  }

// =========================
// GET STUDENT (DO NOT CREATE)
// =========================

const { data: student, error: studentError } = await supabase
  .from('students')
  .select('*')
  .eq('profile_id', profile.id)
  .single();

if (studentError || !student) {
  console.error('Student fetch failed:', studentError);
  throw new Error('Student profile not found. Please complete signup again.');
}


  const { data: newStudent, error: refetchError } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', profile.id)
    .single();

  if (refetchError || !newStudent) {
    throw new Error('Student record still not found after create');
  }

  student = newStudent;
}


  // =========================
  // GET ACTIVE JOBS
  // =========================

  const { data: jobsData } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (
        id,
        company_name,
        verification_status
      )
    `)
    .eq('status', 'active')
    .gt('deadline', new Date().toISOString())
    .eq('companies.verification_status', 'approved');

  const allJobsData = jobsData || [];

  // =========================
  // GET STUDENT APPLICATIONS
  // =========================

  const { data: appCounts } = await supabase
    .from('applications')
    .select('job_id')
    .eq('student_id', student.id);

  const appliedJobIds = new Set((appCounts || []).map(a => a.job_id));

  // =========================
  // ADD APPLICATION COUNTS
  // =========================

  const jobsWithCounts = await Promise.all(
    allJobsData.map(async (job: any) => {
      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', job.id);

      return {
        ...job,
        application_count: count || 0,
        already_applied: appliedJobIds.has(job.id),
      };
    })
  );

  // =========================
  // FETCH APPLICATION LIST
  // =========================

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        *,
        companies (
          company_name
        )
      )
    `)
    .eq('student_id', student.id)
    .order('applied_at', { ascending: false });

  // =========================
  // RECOMMENDATION LOGIC
  // =========================

  const recommendedJobs = jobsWithCounts
    .filter((job: any) => !job.already_applied)
    .map((job: any) => ({
      ...job,
      matchScore: calculateSkillMatch(student.skills, job.skills_required),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  // =========================
  // RETURN DATA
  // =========================

  return {
    profile: profile as Profile,
    student: student as Student,
    jobs: recommendedJobs as Job[],
    applications: (applications || []) as Application[],
  };
}
