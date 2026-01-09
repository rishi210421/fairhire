import { redirect } from 'next/navigation';
import { requireRole, getProfile } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import StudentHeader from '@/components/dashboard/StudentHeader';
import ChatInterface from '@/components/chat/ChatInterface';
import { getStudentData } from '@/lib/student-utils';

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { user, profile } = await requireRole(['student']);
  const supabase = await createClient();
  const { profile: studentProfile, student } = await getStudentData();

  // Get application details
  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        companies (
          id,
          company_name,
          profile_id
        )
      ),
      students (
        id,
        profile_id
      )
    `)
    .eq('id', params.id)
    .eq('student_id', student.id)
    .single();

  if (!application) {
    redirect('/dashboard/applications');
  }

  // Check if chat is enabled (student applied AND status is shortlisted/interview_scheduled/selected)
  const chatEnabled = ['shortlisted', 'interview_scheduled', 'selected'].includes(application.status);

  if (!chatEnabled) {
    redirect(`/dashboard/applications/${params.id}`);
  }

  const companyProfileId = (application.jobs as any)?.companies?.profile_id;
  const receiverId = companyProfileId;

  // Get messages
  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (
        id,
        full_name,
        email
      ),
      receiver:profiles!messages_receiver_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .eq('application_id', params.id)
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader profile={studentProfile} student={student} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600 mt-2">
            {(application.jobs as any)?.title || 'Unknown Job'} - {(application.jobs as any)?.companies?.company_name || 'Unknown Company'}
          </p>
        </div>
        <ChatInterface
          applicationId={params.id}
          senderId={profile.id}
          receiverId={receiverId}
          initialMessages={messages || []}
        />
      </main>
    </div>
  );
}