import Link from 'next/link';
import { CheckCircle2, Users, Briefcase, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">FairHire</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Transparent Internship & Job Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect students with opportunities and companies with talent.
            Built on fairness, transparency, and equal opportunities.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Student Card */}
          <Link href="/signup?role=student">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-16 w-16 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                I am a Student / Candidate
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Find internships and jobs that match your skills. Track your
                applications and get feedback.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Skill-based job recommendations
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Application tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Interview scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Structured feedback
                </li>
              </ul>
            </div>
          </Link>

          {/* Company Card */}
          <Link href="/signup?role=company">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="flex items-center justify-center mb-4">
                <Briefcase className="h-16 w-16 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                I am a Company / Institute
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Post jobs, manage applicants, and hire the best talent with our
                comprehensive platform.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Job posting and management
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Applicant pipeline
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Interview scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  Analytics and insights
                </li>
              </ul>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Secure & Private</h4>
              <p className="text-gray-600">
                Your data is protected with industry-standard security measures.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Transparent Process</h4>
              <p className="text-gray-600">
                Clear application status and feedback throughout the process.
              </p>
            </div>
            <div className="text-center">
              <Briefcase className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h4 className="font-bold text-lg mb-2">Fair Opportunities</h4>
              <p className="text-gray-600">
                Bias-aware matching and equal opportunities for all candidates.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} FairHire. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
