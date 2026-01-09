import type { Job, Application } from '@/types/database';
import { Briefcase, Users, CheckCircle2, XCircle } from 'lucide-react';

interface CompanyStatsProps {
  jobs: Job[];
  applications: Application[];
}

export default function CompanyStats({ jobs, applications }: CompanyStatsProps) {
  const activeJobs = jobs.filter(j => j.status === 'active' && new Date(j.deadline) > new Date()).length;
  const totalApplications = applications.length;
  const selectedCount = applications.filter(a => a.status === 'selected' || a.status === 'offer_verified').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Jobs</h3>
            <p className="text-3xl font-bold text-gray-900">{activeJobs}</p>
          </div>
          <Briefcase className="h-12 w-12 text-indigo-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalApplications}</p>
          </div>
          <Users className="h-12 w-12 text-indigo-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Selected</h3>
            <p className="text-3xl font-bold text-green-600">{selectedCount}</p>
          </div>
          <CheckCircle2 className="h-12 w-12 text-green-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </div>
          <XCircle className="h-12 w-12 text-red-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}