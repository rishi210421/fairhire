import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getStudentData } from '@/lib/student-utils';
import StudentHeader from '@/components/dashboard/StudentHeader';
import ApplicationTracking from '@/components/applications/ApplicationTracking';

export default async function ApplicationsPage() {
  const { user, profile } = await requireRole(['student']);

  if (profile.role !== 'student') {
    redirect('/dashboard');
  }

  const { profile: studentProfile, student, applications } = await getStudentData();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader profile={studentProfile} student={student} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Application Tracking</h1>
          <p className="text-gray-600 mt-2">Track all your job applications</p>
        </div>
        <ApplicationTracking applications={applications} />
      </main>
    </div>
  );
}