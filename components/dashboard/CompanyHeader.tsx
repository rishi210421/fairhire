import Link from 'next/link';
import LogoutButton from '../auth/LogoutButton';
import type { Profile, Company } from '@/types/database';

interface CompanyHeaderProps {
  profile: Profile;
  company: Company;
}

export default function CompanyHeader({ profile, company }: CompanyHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
              FairHire
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/jobs"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Jobs
              </Link>
              <Link
                href="/dashboard/applicants"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Applicants
              </Link>
              <Link
                href="/dashboard/analytics"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{company.company_name}</span>
            <span className="text-gray-500">({profile.full_name})</span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
