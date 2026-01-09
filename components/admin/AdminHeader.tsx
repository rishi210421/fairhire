import Link from 'next/link';
import LogoutButton from '../auth/LogoutButton';
import { Shield } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">FairHire Admin</span>
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/admin"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/companies"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Companies
              </Link>
              <Link
                href="/admin/jobs"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Jobs
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}