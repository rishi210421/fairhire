'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface GlobalMetricsProps {
  companies: Array<{ verification_status: string }>;
  jobs: Array<{ status: string }>;
  applications: Array<{ status: string }>;
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function GlobalMetrics({ companies, jobs, applications }: GlobalMetricsProps) {
  // Company verification status distribution
  const companyStatusData = [
    { name: 'Approved', value: companies.filter(c => c.verification_status === 'approved').length },
    { name: 'Pending', value: companies.filter(c => c.verification_status === 'pending').length },
    { name: 'Rejected', value: companies.filter(c => c.verification_status === 'rejected').length },
  ];

  // Job status distribution
  const jobStatusData = [
    { name: 'Active', value: jobs.filter(j => j.status === 'active').length },
    { name: 'Closed', value: jobs.filter(j => j.status === 'closed').length },
    { name: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length },
  ];

  // Application status distribution
  const applicationStatusData = [
    { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
    { name: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
    { name: 'Interview Scheduled', value: applications.filter(a => a.status === 'interview_scheduled').length },
    { name: 'Selected', value: applications.filter(a => a.status === 'selected').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'rejected').length },
    { name: 'Offer Verified', value: applications.filter(a => a.status === 'offer_verified').length },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Company Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Company Verification Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={companyStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {companyStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Job Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Job Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={jobStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {jobStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Application Status */}
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={applicationStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4F46E5" name="Applications" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}