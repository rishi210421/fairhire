import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { getCompanyData } from '@/lib/company-utils'
import CompanyHeader from '@/components/dashboard/CompanyHeader'
import ChatInterface from '@/components/chat/ChatInterface'
import { createClient } from '@/lib/supabase/server'

interface CompanyChatPageProps {
  params: {
    id: string
  }
}

export default async function CompanyChatPage({ params }: CompanyChatPageProps) {
  const { profile } = (await requireRole(['company'])) as any
  const data = await getCompanyData()

  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  const { data: rawApplication } = await supabase
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
    .single()

  if (!rawApplication) {
    redirect('/dashboard/applicants')
  }

  const application = rawApplication as any
  const job = application.jobs as any

  if (!job || job.company_id !== data.company.id) {
    redirect('/dashboard/applicants')
  }

  const chatEnabled = ['shortlisted', 'interview_scheduled', 'selected'].includes(
    application.status
  )

  if (!chatEnabled) {
    redirect(`/dashboard/applicants/${params.id}`)
  }

  const student = application.students as any
  const receiverId = student?.profile_id

  if (!receiverId) {
    redirect('/dashboard/applicants')
  }

  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', receiverId)
    .single()

  const studentName =
    (studentProfile as any)?.full_name || 'Unknown Student'

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
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600 mt-2">
            {job?.title || 'Unknown Job'} - {studentName}
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
  )
}
