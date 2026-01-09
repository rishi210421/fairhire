'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Clock, Users, IndianRupee } from 'lucide-react';
import { formatDate, formatCurrency, isPastDeadline } from '@/lib/utils';
//import { createClient } from '@/lib/supabase/client';
import type { Job, Application, Student } from '@/types/database';
import { supabase } from '@/lib/supabase/client';
interface RecommendedJobsProps {
  jobs: Job[];
  applications: Application[];
  student: Student;
}

export default function RecommendedJobs({ jobs, applications, student }: RecommendedJobsProps) {
  //const supabase = createClient(); // ✅ FIX: create client properly

  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const appliedJobIds = new Set(applications.map(a => a.job_id));
  const now = new Date();

  const handleApply = async (job: Job) => {
    if (loading) return;

    if (appliedJobIds.has(job.id)) {
      setError('You have already applied for this job');
      return;
    }

    if (student.freeze_until && new Date(student.freeze_until) > now) {
      setError('Your applications are frozen. Please wait until the freeze period ends.');
      return;
    }

    setLoading(job.id);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('User not logged in');
      }

      // ✅ get student id safely
      const { data: studentData, error: studentErr } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (studentErr || !studentData) {
        throw new Error('Student record not found');
      }

      // check limit
      const { count, error: countErr } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', job.id);

      if (countErr) throw countErr;

      if ((count || 0) >= job.applicant_limit) {
        throw new Error('Application limit reached for this job');
      }

      // insert application
      const { error: applyError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          student_id: studentData.id,
          status: 'applied',
        });

      if (applyError) throw applyError;

      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to apply');
    } finally {
      setLoading(null);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No recommended jobs at the moment. Check back later!</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const alreadyApplied = appliedJobIds.has(job.id);
          const deadlinePassed = isPastDeadline(job.deadline);
          const applicationCount = job.application_count || 0;
          const isFull = applicationCount >= job.applicant_limit;
          const canApply =
            !alreadyApplied &&
            !deadlinePassed &&
            !isFull &&
            (!student.freeze_until || new Date(student.freeze_until) <= now);

          const companyName = (job as any).companies?.company_name || 'Unknown Company';

          return (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{companyName}</span>
                  </div>
                </div>
                {job.matchScore && (
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {job.matchScore}% Match
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  <span className="font-medium">{formatCurrency(job.stipend)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {applicationCount}/{job.applicant_limit} applicants
                  </span>
                </div>
              </div>

              <div className="mb-4">
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
                    <span className="text-gray-500 text-xs">
                      +{job.skills_required.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleApply(job)}
                disabled={!canApply || loading === job.id}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  canApply
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading === job.id
                  ? 'Applying...'
                  : alreadyApplied
                  ? 'Already Applied'
                  : deadlinePassed
                  ? 'Deadline Passed'
                  : isFull
                  ? 'Application Full'
                  : 'Apply Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
