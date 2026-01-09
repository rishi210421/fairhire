import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getCompanyData } from '@/lib/company-utils';
import CompanyHeader from '@/components/dashboard/CompanyHeader';
import ChatInterface from '@/components/chat/ChatInterface';

interface CompanyChatPageProps {
  params: {
    id: string;
  };
}

export default async function CompanyChatPage({ params }: CompanyChatPageProps) {
  const { user, profile } = await requireRole(['company']);
  const data = await getCompanyData();

  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard');
  }

  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();

  // Get application details
  const { data: application } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        company_id
      ),
      students (
        id,
        profile_id
      )
    `)
    .eq('id', params.id)
    .single();

  if (!application) {
    redirect('/dashboard/applicants');
  }

  // Verify this application belongs to company's job
  const job = application.jobs as any;
  if (job.company_id !== data.company.id) {
    redirect('/dashboard/applicants');
  }

  // Check if chat is enabled
  const chatEnabled = ['shortlisted', 'interview_scheduled', 'selected'].includes(application.status);

  if (!chatEnabled) {
    redirect(`/dashboard/applicants/${params.id}`);
  }

  const student = application.students as any;
  const receiverId = student?.profile_id;

  if (!receiverId) {
    redirect('/dashboard/applicants');
  }

  // Get student profile for display
  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', receiverId)
    .single();

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
      <CompanyHeader profile={data.profile} company={data.company} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600 mt-2">
            {job?.title || 'Unknown Job'} - {studentProfile?.full_name || 'Unknown Student'}
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