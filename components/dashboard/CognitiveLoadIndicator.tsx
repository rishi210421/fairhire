'use client';

import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { Student, Application } from '@/types/database';

interface CognitiveLoadIndicatorProps {
  student: Student;
  applications: Application[];
}

export default function CognitiveLoadIndicator({ student, applications }: CognitiveLoadIndicatorProps) {
  const now = new Date();
  const freezeUntil = student.freeze_until ? new Date(student.freeze_until) : null;
  const isFrozen = freezeUntil && freezeUntil > now;

  // Calculate cognitive load metrics
  const activeApplications = applications.filter(
    a => !['rejected', 'offer_verified'].includes(a.status)
  ).length;

  const upcomingDeadlines = applications.filter(a => {
    if (!a.job) return false;
    const deadline = new Date(a.job.deadline);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  }).length;

  const interviewsScheduled = applications.filter(
    a => a.status === 'interview_scheduled'
  ).length;

  // Thresholds
  const MAX_ACTIVE_APPLICATIONS = 10;
  const MAX_UPCOMING_DEADLINES = 5;
  const MAX_INTERVIEWS = 5;

  const isOverloaded = 
    activeApplications >= MAX_ACTIVE_APPLICATIONS ||
    upcomingDeadlines >= MAX_UPCOMING_DEADLINES ||
    interviewsScheduled >= MAX_INTERVIEWS;

  if (isFrozen) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-red-800 font-bold">Application Freeze Active</h3>
            <p className="text-red-700">
              Your applications are frozen until {freezeUntil?.toLocaleDateString()}. 
              This helps manage your cognitive load and ensures quality applications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isOverloaded) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <h3 className="text-yellow-800 font-bold">High Cognitive Load Detected</h3>
            <p className="text-yellow-700 mb-2">
              You have a high number of active applications, upcoming deadlines, or scheduled interviews.
              Consider focusing on quality over quantity.
            </p>
            <div className="text-sm text-yellow-700">
              <p>• Active Applications: {activeApplications}/{MAX_ACTIVE_APPLICATIONS}</p>
              <p>• Upcoming Deadlines (7 days): {upcomingDeadlines}/{MAX_UPCOMING_DEADLINES}</p>
              <p>• Scheduled Interviews: {interviewsScheduled}/{MAX_INTERVIEWS}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        <div>
          <h3 className="text-green-800 font-bold">Good Application Health</h3>
          <p className="text-green-700">
            Your application load is manageable. Active: {activeApplications}, 
            Upcoming Deadlines: {upcomingDeadlines}, Interviews: {interviewsScheduled}
          </p>
        </div>
      </div>
    </div>
  );
}
