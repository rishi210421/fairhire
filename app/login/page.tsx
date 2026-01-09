import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default async function LoginPage() {
  const session = await getSession();
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <Briefcase className="h-10 w-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to your FairHire account
          </p>
          
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
