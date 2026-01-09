'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileCheck, Eye } from 'lucide-react';
import type { Application, Job } from '@/types/database';

interface ApplicantPipelineProps {
  applications: any[];
  jobs: Job[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  applied: { label: 'Applied', color: 'bg-blue-100 text-blue-800', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-purple-100 text-purple-800', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  selected: { label: 'Selected', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  offer_verified: { label: 'Offer Verified', color: 'bg-indigo-100 text-indigo-800', icon: FileCheck },
};

const statusFlow = ['applied', 'shortlisted', 'interview_scheduled', 'selected', 'offer_verified'];

export default function ApplicantPipeline({ applications, jobs }: ApplicantPipelineProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const filteredApplications = selectedJob
    ? applications.filter((app: any) => app.job_id === selectedJob)
    : applications;

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setLoading(applicationId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(null);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No applications yet.</p>
      </div>
    );
  }

  // Group by status
  const groupedByStatus: Record<string, any[]> = {};
  filteredApplications.forEach((app: any) => {
    if (!groupedByStatus[app.status]) {
      groupedByStatus[app.status] = [];
    }
    groupedByStatus[app.status].push(app);
  });

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Job Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Job
        </label>
        <select
          value={selectedJob || ''}
          onChange={(e) => setSelectedJob(e.target.value || null)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Pipeline by Status */}
      <div className="space-y-6">
        {statusFlow.map((status) => {
          const apps = groupedByStatus[status] || [];
          if (apps.length === 0) return null;

          const config = statusConfig[status] || statusConfig.applied;
          const StatusIcon = config.icon;
          const currentIndex = statusFlow.indexOf(status);
          const canMoveToNext = currentIndex < statusFlow.length - 1;
          const canMoveToPrevious = currentIndex > 0;

          return (
            <div key={status} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <StatusIcon className={`h-5 w-5 mr-2 ${config.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                  {config.label} ({apps.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {apps.map((application: any) => {
                  const job = application.jobs;
                  const studentProfile = application.student_profile;
                  const student = application.students;

                  return (
                    <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {studentProfile?.full_name || 'Unknown'}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {studentProfile?.email || 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <p><strong>Job:</strong> {job?.title || 'Unknown'}</p>
                            {student?.education && (
                              <p><strong>Education:</strong> {student.education}</p>
                            )}
                            {student?.skills && student.skills.length > 0 && (
                              <p><strong>Skills:</strong> {student.skills.join(', ')}</p>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Applied on {formatDate(application.applied_at)}
                          </p>
                          {application.interviews && application.interviews.length > 0 && (
                            <p className="text-sm text-indigo-600 mt-1">
                              {application.interviews.length} interview(s) scheduled
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <Link
                            href={`/dashboard/applicants/${application.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                          <div className="flex space-x-2">
                            {canMoveToPrevious && (
                              <button
                                onClick={() => handleStatusChange(application.id, statusFlow[currentIndex - 1])}
                                disabled={loading === application.id}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
                              >
                                ← Prev
                              </button>
                            )}
                            {canMoveToNext && (
                              <button
                                onClick={() => handleStatusChange(application.id, statusFlow[currentIndex + 1])}
                                disabled={loading === application.id}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50"
                              >
                                Next →
                              </button>
                            )}
                            <button
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                              disabled={loading === application.id}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Rejected Applications */}
        {groupedByStatus.rejected && groupedByStatus.rejected.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
                Rejected ({groupedByStatus.rejected.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {groupedByStatus.rejected.map((application: any) => {
                const job = application.jobs;
                const studentProfile = application.student_profile;

                return (
                  <div key={application.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {studentProfile?.full_name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{job?.title || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">
                          Applied on {formatDate(application.applied_at)}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/applicants/${application.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}