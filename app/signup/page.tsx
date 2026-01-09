import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface SignupPageProps {
  searchParams: {
    role?: string;
  };
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = await getSession();
  
  if (session) {
    redirect('/dashboard');
  }

  const role = searchParams.role === 'student' || searchParams.role === 'company' 
    ? searchParams.role 
    : null;

  if (!role) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Briefcase className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Join FairHire as a {role === 'student' ? 'Student' : 'Company'}
          </p>
          
          <SignupForm role={role} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
