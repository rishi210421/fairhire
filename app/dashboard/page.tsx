import { redirect } from 'next/navigation'
import { getProfile, checkAdmin } from '@/lib/auth'
import StudentDashboard from '@/components/dashboard/StudentDashboard'
import CompanyDashboard from '@/components/dashboard/CompanyDashboard'
import AdminRedirect from '@/components/dashboard/AdminRedirect'

export default async function DashboardPage() {
  const profile = await getProfile()
  const isAdmin = await checkAdmin()

  if (!profile) {
    redirect('/login')
  }

  if (isAdmin) {
    return <AdminRedirect />
  }

  const role = String(profile.role)

  if (role === 'student') return <StudentDashboard />
  if (role === 'company') return <CompanyDashboard />

  redirect('/login')
}
