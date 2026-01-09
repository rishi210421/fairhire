// @ts-nocheck
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { getCompanyData } from '@/lib/company-utils'
import CompanyHeader from '@/components/dashboard/CompanyHeader'
import ApplicantDetail from '@/components/applicants/ApplicantDetail'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ApplicantDetailPage({ params }: PageProps) {
  await requireRole(['company'])
  const data = await getCompanyData()

  if (!data.company || data.company.verification_status !== 'approved') {
    redirect('/dashboard')
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()

  // Get application with relations
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
    .single()

  if (!application) {
    redirect('/dashboard/applicants')
  }

  const job = (application as any).jobs;



  if (!job || job.company_id !== data.company.id) {
    redirect('/dashboard/applicants')
  }

  const student = (application as any).students
  const studentProfileId = student?.profile_id

  if (!studentProfileId) {
    redirect('/dashboard/applicants')
  }

  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', studentProfileId)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicantDetail
          application={application as any}
          studentProfile={studentProfile as any}
          companyId={data.company.id}
        />
      </main>
    </div>
  )
}
