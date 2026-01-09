import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { getStudentData } from '@/lib/student-utils';
import { getCompanyData } from '@/lib/company-utils';
import StudentHeader from '@/components/dashboard/StudentHeader';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import JobListings from '@/components/jobs/JobListings';
import CompanyJobListings from '@/components/jobs/CompanyJobListings';
import Link from 'next/link';

export default async function JobsPage() {
  const profile = await getProfile();

  if (!profile) {
    redirect('/login');
  }

  if (profile.role === 'student') {
    const { profile: studentProfile, student, jobs, applications } = await getStudentData();
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader profile={studentProfile} student={student} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
            <p className="text-gray-600 mt-2">Browse all available internships and jobs</p>
          </div>
          <JobListings jobs={jobs} applications={applications} student={student} />
        </main>
      </div>
    );
  }

  if (profile.role === 'company') {
    const data = await getCompanyData();
    if (!data.company || data.company.verification_status !== 'approved') {
      redirect('/dashboard');
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <CompanyHeader profile={data.profile} company={data.company} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
              <p className="text-gray-600 mt-2">Manage your job postings</p>
            </div>
            <Link
              href="/dashboard/jobs/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Post New Job
            </Link>
          </div>
          <CompanyJobListings jobs={data.jobs} />
        </main>
      </div>
    );
  }

  redirect('/dashboard');
}