import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Job } from '@/types/database';
import { Briefcase, Clock, Users, IndianRupee, Eye, Edit } from 'lucide-react';

interface CompanyJobListingsProps {
  jobs: Job[];
}

export default function CompanyJobListings({ jobs }: CompanyJobListingsProps) {
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Skills Required
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stipend
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deadline
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                <div className="text-sm text-gray-500 line-clamp-2">{job.description}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills_required.length > 3 && (
                    <span className="text-gray-500 text-xs">+{job.skills_required.length - 3} more</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatCurrency(job.stipend)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(job.deadline)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}