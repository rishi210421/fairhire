import { Clock, Mail } from 'lucide-react';
import type { Company } from '@/types/database';
import LogoutButton from '../auth/LogoutButton';

interface VerificationPendingProps {
  company: Company | null;
}

export default function VerificationPending({ company }: VerificationPendingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verification Pending
          </h1>
          <p className="text-gray-600">
            Your company account is awaiting admin verification
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
          <div className="flex items-start">
            <Mail className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-bold mb-2">What's Next?</h3>
              <p className="text-yellow-700 mb-2">
                Your company registration has been submitted successfully. Our admin team will review
                your details and verify your account.
              </p>
              {company && (
                <div className="text-sm text-yellow-700 mt-4">
                  <p><strong>Company:</strong> {company.company_name}</p>
                  {company.hr_contact && (
                    <p><strong>HR Contact:</strong> {company.hr_contact}</p>
                  )}
                </div>
              )}
              <p className="text-yellow-700 mt-4">
                You'll receive an email notification once your account is verified. You can then
                start posting jobs and managing applications.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
