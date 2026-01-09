import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types/database';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

interface RecentApplicationsProps {
  applications: Application[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  selected: { label: 'Selected', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  offer_verified: { label: 'Offer Verified', color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle2 },
};

export default function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No applications yet.</p>
      </div>
    );
  }

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
        <Link
          href="/dashboard/applicants"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All →
        </Link>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applicant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {recentApplications.map((application) => {
            const job = (application as any).jobs;
            const studentProfile = (application as any).student_profile;
            const config = statusConfig[application.status] || statusConfig.applied;
            const StatusIcon = config.icon;

            return (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {studentProfile?.full_name || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {studentProfile?.email || ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job?.title || 'Unknown Job'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(application.applied_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link
                    href={`/dashboard/applicants/${application.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}