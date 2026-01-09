import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import StudentHeader from '@/components/dashboard/StudentHeader';
import CalendarView from '@/components/calendar/CalendarView';
import { getStudentData } from '@/lib/student-utils';

export default async function CalendarPage() {
  const { user, profile } = await requireRole(['student']);

  if (profile.role !== 'student') {
    redirect('/dashboard');
  }

  const supabase = await createClient();
  const { profile: studentProfile, student } = await getStudentData();

  // Get all events for the student
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('profile_id', profile.id)
    .order('starts_at', { ascending: true });

  // Get interviews for applications
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id,
      interviews (
        id,
        round_number,
        scheduled_at,
        duration_minutes,
        meeting_link,
        notes
      ),
      jobs (
        title,
        companies (
          company_name
        )
      )
    `)
    .eq('student_id', student.id);

  // Transform interviews into events
  const interviewEvents = (applications || []).flatMap((app: any) => {
    if (!app.interviews) return [];
    return app.interviews.map((interview: any) => ({
      id: interview.id,
      profile_id: profile.id,
      title: `Interview: ${app.jobs?.title || 'Unknown'}`,
      description: `Round ${interview.round_number} - ${app.jobs?.companies?.company_name || 'Unknown Company'}`,
      event_type: 'interview' as const,
      starts_at: interview.scheduled_at,
      ends_at: interview.scheduled_at ? new Date(new Date(interview.scheduled_at).getTime() + (interview.duration_minutes || 60) * 60000).toISOString() : null,
      metadata: {
        application_id: app.id,
        interview_id: interview.id,
        round_number: interview.round_number,
        meeting_link: interview.meeting_link,
        notes: interview.notes,
      },
      created_at: interview.created_at || new Date().toISOString(),
      updated_at: interview.updated_at || new Date().toISOString(),
    }));
  });

  const allEvents = [...(events || []), ...interviewEvents];

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader profile={studentProfile} student={student} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-2">Manage your interviews, deadlines, and events</p>
        </div>
        <CalendarView events={allEvents} profileId={profile.id} />
      </main>
    </div>
  );
}