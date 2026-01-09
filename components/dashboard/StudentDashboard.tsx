import { getStudentData } from '@/lib/student-utils';
import StudentHeader from './StudentHeader';
import RecommendedJobs from './RecommendedJobs';
import ApplicationStatus from './ApplicationStatus';
import CognitiveLoadIndicator from './CognitiveLoadIndicator';
import Link from 'next/link';
export default async function StudentDashboard() {
  
  
  const data = await getStudentData();


  const { profile, student, jobs, applications } = await getStudentData();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader profile={profile} student={student} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cognitive Load Indicator */}
        <CognitiveLoadIndicator student={student} applications={applications} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Applications</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {applications.filter(a => !['rejected', 'offer_verified'].includes(a.status)).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Interviews Scheduled</h3>
            <p className="text-3xl font-bold text-green-600">
              {applications.filter(a => a.status === 'interview_scheduled').length}
            </p>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Jobs</h2>
            <Link
              href="/dashboard/jobs"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <RecommendedJobs jobs={jobs} applications={applications} student={student} />
        </div>

        {/* Application Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
            <Link
              href="/dashboard/applications"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <ApplicationStatus applications={applications.slice(0, 5)} />
        </div>
      </main>
    </div>
  );
}
