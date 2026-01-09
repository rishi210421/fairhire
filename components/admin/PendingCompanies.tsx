'use client';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Company {
  id: string;
  company_name: string;
  organization_type: string | null;
  website: string | null;
  hr_contact: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    created_at: string;
  };
}

interface PendingCompaniesProps {
  companies: Company[];
}

export default function PendingCompanies({ companies: initialCompanies }: PendingCompaniesProps) {
  const supabase = createClient(); 

  const [companies, setCompanies] = useState(initialCompanies);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerification = async (
    companyId: string,
    status: 'approved' | 'rejected'
  ) => {
    setLoading(companyId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('companies')
        .update({ verification_status: status })
        .eq('id', companyId);

      if (updateError) throw updateError;

      // Keep only pending companies in UI
      setCompanies((prev) =>
        prev.filter((c) => c.id !== companyId)
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update verification status');
    } finally {
      setLoading(null);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No pending verifications.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {company.company_name}
                  </div>
                  {company.organization_type && (
                    <div className="text-sm text-gray-500">
                      {company.organization_type}
                    </div>
                  )}
                  {company.website && (
                    <div className="text-sm text-gray-500">
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {company.profiles?.full_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {company.profiles?.email || 'N/A'}
                  </div>
                  {company.profiles?.phone && (
                    <div className="text-sm text-gray-500">
                      {company.profiles.phone}
                    </div>
                  )}
                  {company.hr_contact && (
                    <div className="text-sm text-gray-500">
                      HR: {company.hr_contact}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(company.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleVerification(company.id, 'approved')}
                    disabled={loading === company.id}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === company.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerification(company.id, 'rejected')}
                    disabled={loading === company.id}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === company.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
