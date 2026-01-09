import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { Application } from '@/types/database';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileCheck } from 'lucide-react';

interface ApplicationTrackingProps {
  applications: Application[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  selected: { label: 'Selected', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  offer_verified: { label: 'Offer Verified', color: 'bg-indigo-100 text-indigo-800', icon: FileCheck },
};

export default function ApplicationTracking({ applications }: ApplicationTrackingProps) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No applications yet. Start applying to jobs!</p>
      </div>
    );
  }

  // Group applications by status
  const groupedByStatus: Record<string, Application[]> = {};
  applications.forEach(app => {
    if (!groupedByStatus[app.status]) {
      groupedByStatus[app.status] = [];
    }
    groupedByStatus[app.status].push(app);
  });

  const statusOrder = ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'offer_verified', 'rejected'];

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        const apps = groupedByStatus[status] || [];
        if (apps.length === 0) return null;

        const config = statusConfig[status] || statusConfig.applied;
        const StatusIcon = config.icon;

        return (
          <div key={status} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <StatusIcon className={`h-5 w-5 mr-2 ${config.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                {config.label} ({apps.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {apps.map((application) => {
                const job = (application as any).jobs;
                const companyName = job?.companies?.company_name || 'Unknown Company';

                return (
                  <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job?.title || 'Unknown Job'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {config.label}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{companyName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied on {formatDate(application.applied_at)}
                        </p>
                        {(application as any).interviews && (application as any).interviews.length > 0 && (
                          <p className="text-sm text-indigo-600 mt-1">
                            {((application as any).interviews as any[]).length} interview(s) scheduled
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/dashboard/applications/${application.id}`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          View Details
                        </Link>
                        {['shortlisted', 'interview_scheduled', 'selected'].includes(application.status) && (
                          <Link
                            href={`/dashboard/applications/${application.id}/chat`}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Chat
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}