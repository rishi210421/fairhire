'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { Job, Application } from '@/types/database';

interface CompanyAnalyticsProps {
  jobs: Job[];
  applications: any[];
}

const COLORS = ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function CompanyAnalytics({ jobs, applications }: CompanyAnalyticsProps) {
  // Application status distribution
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};
    applications.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      value: count,
    }));
  }, [applications]);

  // Conversion funnel
  const funnelData = useMemo(() => {
    return [
      { name: 'Applied', value: applications.filter(a => a.status === 'applied').length },
      { name: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length },
      { name: 'Interview', value: applications.filter(a => a.status === 'interview_scheduled').length },
      { name: 'Selected', value: applications.filter(a => a.status === 'selected' || a.status === 'offer_verified').length },
    ];
  }, [applications]);

  // Per job statistics
  const jobStats = useMemo(() => {
    return jobs.map(job => {
      const jobApplications = applications.filter(a => a.job_id === job.id);
      return {
        job: job.title,
        applied: jobApplications.length,
        shortlisted: jobApplications.filter(a => a.status === 'shortlisted').length,
        selected: jobApplications.filter(a => a.status === 'selected' || a.status === 'offer_verified').length,
        rejected: jobApplications.filter(a => a.status === 'rejected').length,
      };
    });
  }, [jobs, applications]);

  // Skills analysis - branch/education vs selection ratio
  const skillsAnalysis = useMemo(() => {
    const educationMap: Record<string, { total: number; selected: number }> = {};
    
    applications.forEach(app => {
      const education = app.students?.education || 'Unknown';
      if (!educationMap[education]) {
        educationMap[education] = { total: 0, selected: 0 };
      }
      educationMap[education].total++;
      if (app.status === 'selected' || app.status === 'offer_verified') {
        educationMap[education].selected++;
      }
    });

    return Object.entries(educationMap).map(([education, data]) => ({
      name: education,
      total: data.total,
      selected: data.selected,
      ratio: data.total > 0 ? ((data.selected / data.total) * 100).toFixed(1) : '0',
    }));
  }, [applications]);

  // Stage-wise dropouts
  const dropoutData = useMemo(() => {
    const applied = applications.filter(a => a.status === 'applied').length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted').length;
    const interview = applications.filter(a => a.status === 'interview_scheduled').length;
    const selected = applications.filter(a => a.status === 'selected' || a.status === 'offer_verified').length;

    return [
      { stage: 'Applied → Shortlisted', entered: applied, exited: applied - shortlisted, remaining: shortlisted },
      { stage: 'Shortlisted → Interview', entered: shortlisted, exited: shortlisted - interview, remaining: interview },
      { stage: 'Interview → Selected', entered: interview, exited: interview - selected, remaining: selected },
    ];
  }, [applications]);

  return (
    <div className="space-y-8">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-indigo-600">{applications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Shortlisted</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {applications.filter(a => a.status === 'shortlisted').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Selected</h3>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter(a => a.status === 'selected' || a.status === 'offer_verified').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {applications.filter(a => a.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4F46E5" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stage-wise Dropouts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Stage-wise Dropouts</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dropoutData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entered" fill="#4F46E5" name="Entered Stage" />
            <Bar dataKey="exited" fill="#EF4444" name="Dropped Out" />
            <Bar dataKey="remaining" fill="#10B981" name="Remaining" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per Job Statistics */}
      {jobStats.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Per Job Statistics</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={jobStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applied" fill="#3B82F6" name="Applied" />
              <Bar dataKey="shortlisted" fill="#F59E0B" name="Shortlisted" />
              <Bar dataKey="selected" fill="#10B981" name="Selected" />
              <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Education/Branch Analysis */}
      {skillsAnalysis.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Education/Branch vs Selection Ratio</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Education/Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Applicants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selected
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Selection Ratio (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skillsAnalysis.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.selected}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.ratio}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Status Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Application Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}