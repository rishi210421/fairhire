import { Briefcase, Users, FileText, Building2 } from 'lucide-react';

interface AdminStatsProps {
  companies: Array<{ verification_status: string }>;
  jobs: Array<{ status: string }>;
  applications: Array<{ status: string }>;
  profiles: Array<{ role: string }>;
}

export default function AdminStats({ companies, jobs, applications, profiles }: AdminStatsProps) {
  const totalCompanies = companies.length;
  const approvedCompanies = companies.filter(c => c.verification_status === 'approved').length;
  const pendingCompanies = companies.filter(c => c.verification_status === 'pending').length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalApplications = applications.length;
  const students = profiles.filter(p => p.role === 'student').length;
  const companyUsers = profiles.filter(p => p.role === 'company').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Companies</h3>
            <p className="text-3xl font-bold text-gray-900">{totalCompanies}</p>
            <p className="text-sm text-gray-500 mt-1">
              {approvedCompanies} approved, {pendingCompanies} pending
            </p>
          </div>
          <Building2 className="h-12 w-12 text-indigo-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Jobs</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalJobs}</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeJobs} active
            </p>
          </div>
          <Briefcase className="h-12 w-12 text-indigo-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-green-600">{totalApplications}</p>
          </div>
          <FileText className="h-12 w-12 text-green-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Users</h3>
            <p className="text-3xl font-bold text-purple-600">{profiles.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {students} students, {companyUsers} companies
            </p>
          </div>
          <Users className="h-12 w-12 text-purple-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}