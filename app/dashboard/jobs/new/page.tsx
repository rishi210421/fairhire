import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import CreateJobForm from '@/components/jobs/CreateJobForm';

export default async function NewJobPage() {
  const { user, profile } = await requireRole(['company']);

  if (profile.role !== 'company') {
    redirect('/dashboard');
  }

  const data = await getCompanyData();

  // Check if company is verified
  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600 mt-2">Create a new job posting</p>
        </div>
        <CreateJobForm companyId={data.company.id} />
      </main>
    </div>
  );
}