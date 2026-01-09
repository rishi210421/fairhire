import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Job } from '@/types/database';
import { Briefcase, Clock, Users, IndianRupee } from 'lucide-react';

interface RecentJobsProps {
  jobs: Job[];
}

export default function RecentJobs({ jobs }: RecentJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 mb-4">No jobs posted yet.</p>
        <Link
          href="/dashboard/jobs/new"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Post Your First Job
        </Link>
      </div>
    );
  }

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
        <Link
          href="/dashboard/jobs"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All →
        </Link>
      </div>
      <div className="divide-y divide-gray-200">
        {recentJobs.map((job) => (
          <div key={job.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                >
                  {job.title}
                </Link>
                <p className="text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span>{formatCurrency(job.stipend)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Limit: {job.applicant_limit}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-800' :
                    job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}