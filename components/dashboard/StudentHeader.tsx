import { supabase } from '@/lib/supabase/client';
import LogoutButton from '../auth/LogoutButton';
import Link from 'next/link';
import type { Profile, Student } from '@/types/database';

interface StudentHeaderProps {
  profile: Profile;
  student: Student;
}

export default function StudentHeader({ profile, student }: StudentHeaderProps) {
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
                Home
              </Link>
              <Link
                href="/dashboard/jobs"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Jobs
              </Link>
              <Link
                href="/dashboard/applications"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Applications
              </Link>
              <Link
                href="/dashboard/calendar"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Calendar
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{profile.full_name}</span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
