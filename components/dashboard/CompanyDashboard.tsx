import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from './CompanyHeader';
import VerificationPending from './VerificationPending';
import CompanyStats from './CompanyStats';
import RecentApplications from './RecentApplications';
import RecentJobs from './RecentJobs';

export default async function CompanyDashboard() {
  const data = await getCompanyData();

  // Check if company is verified
  if (!data.company || data.company.verification_status !== 'approved') {
    return <VerificationPending company={data.company} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <CompanyStats jobs={data.jobs} applications={data.applications} />

        {/* Recent Jobs */}
        <div className="mb-8">
          <RecentJobs jobs={data.jobs} />
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <RecentApplications applications={data.applications} />
        </div>
      </main>
    </div>
  );
}
