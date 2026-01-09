import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { getCompanyData } from '@/lib/company-utils'
import CompanyHeader from '@/components/dashboard/CompanyHeader'
import ApplicantDetail from '@/components/applicants/ApplicantDetail'
import { createClient } from '@/lib/supabase/server'

interface ApplicantDetailPageProps {
  params: {
    id: string
  }
}

export default async function ApplicantDetailPage({
  params,
}: ApplicantDetailPageProps) {
  await requireRole(['company'])
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
      ),
      profiles (
        id,
        full_name,
        email
      )
    `)
    .eq('id', params.id)
    .single()

  if (!rawApplication) {
    redirect('/dashboard/applicants')
  }

  const application = rawApplication as any
  const job = application.jobs as any

  // Verify this application belongs to company's job
  if (!job || job.company_id !== data.company.id) {
    redirect('/dashboard/applicants')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader profile={data.profile} company={data.company} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApplicantDetail application={application} />
      </main>
    </div>
  )
}
