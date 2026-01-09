'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface CreateJobFormProps {
  companyId: string;
}

export default function CreateJobForm({ companyId }: CreateJobFormProps) {
  const router = useRouter();
  const supabase = createClient(); // ✅ BROWSER CLIENT

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: '',
    stipend: '',
    applicant_limit: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const skillsArray = formData.skills_required
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (skillsArray.length === 0) {
        throw new Error('Please enter at least one skill');
      }

      const { error: insertError } = await supabase.from('jobs').insert({
        company_id: companyId,
        title: formData.title,
        description: formData.description,
        skills_required: skillsArray,
        stipend: parseFloat(formData.stipend),
        applicant_limit: parseInt(formData.applicant_limit),
        deadline: new Date(formData.deadline).toISOString(),
        status: 'active',
      });

      if (insertError) throw insertError;

      router.push('/dashboard/jobs');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Full Stack Developer Intern"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Job description and requirements..."
          />
        </div>

        <div>
          <label htmlFor="skills_required" className="block text-sm font-medium text-gray-700 mb-1">
            Skills Required (comma-separated) *
          </label>
          <input
            id="skills_required"
            type="text"
            value={formData.skills_required}
            onChange={(e) =>
              setFormData({ ...formData, skills_required: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., JavaScript, React, Node.js, TypeScript"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 mb-1">
              Stipend (₹) *
            </label>
            <input
              id="stipend"
              type="number"
              value={formData.stipend}
              onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="applicant_limit" className="block text-sm font-medium text-gray-700 mb-1">
              Applicant Limit *
            </label>
            <input
              id="applicant_limit"
              type="number"
              value={formData.applicant_limit}
              onChange={(e) =>
                setFormData({ ...formData, applicant_limit: e.target.value })
              }
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
            Application Deadline *
          </label>
          <input
            id="deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
