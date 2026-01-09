'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate, formatDateTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, FileText, Calendar, MessageSquare, Send } from 'lucide-react';

interface ApplicantDetailProps {
  application: any;
  studentProfile: any;
  companyId: string;
}

export default function ApplicantDetail({ application, studentProfile, companyId }: ApplicantDetailProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [interviewData, setInterviewData] = useState({
    round_number: (application.interviews?.length || 0) + 1,
    scheduled_at: '',
    duration_minutes: '60',
    meeting_link: '',
    notes: '',
  });

  const [feedbackData, setFeedbackData] = useState({
    selection_reasoning: application.feedback?.selection_reasoning || '',
    general_feedback: application.feedback?.general_feedback || '',
  });

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check for conflicts
      const { data: existingInterviews } = await supabase
        .from('interviews')
        .select('scheduled_at')
        .eq('application_id', application.id);

      const scheduledTime = new Date(interviewData.scheduled_at);
      const duration = parseInt(interviewData.duration_minutes);
      const endTime = new Date(scheduledTime.getTime() + duration * 60000);

      const hasConflict = existingInterviews?.some((interview) => {
        const existingTime = new Date(interview.scheduled_at);
        return (
          (scheduledTime >= existingTime && scheduledTime < new Date(existingTime.getTime() + 60 * 60000)) ||
          (endTime > existingTime && endTime <= new Date(existingTime.getTime() + 60 * 60000))
        );
      });

      if (hasConflict) {
        throw new Error('Interview time conflicts with existing interview');
      }

      const { error: insertError } = await supabase
        .from('interviews')
        .insert({
          application_id: application.id,
          round_number: interviewData.round_number,
          scheduled_at: scheduledTime.toISOString(),
          duration_minutes: duration,
          meeting_link: interviewData.meeting_link || null,
          notes: interviewData.notes || null,
        });

      if (insertError) throw insertError;

      // Update application status if not already
      if (application.status !== 'interview_scheduled') {
        await supabase
          .from('applications')
          .update({ status: 'interview_scheduled' })
          .eq('id', application.id);
      }

      setShowScheduleModal(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!feedbackData.general_feedback.trim()) {
        throw new Error('General feedback is required');
      }

      const { error: upsertError } = await supabase
        .from('feedback')
        .upsert({
          application_id: application.id,
          selection_reasoning: feedbackData.selection_reasoning || null,
          general_feedback: feedbackData.general_feedback,
        });

      if (upsertError) throw upsertError;

      setShowFeedbackModal(false);
      alert('Feedback submitted successfully!');
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const student = application.students;
  const job = application.jobs;

  return (
    <div>
      <Link
        href="/dashboard/applicants"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Applicants
      </Link>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {studentProfile?.full_name || 'Unknown Applicant'}
          </h1>
          <p className="text-gray-600">
            {job?.title || 'Unknown Job'}
          </p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
            application.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
            application.status === 'interview_scheduled' ? 'bg-purple-100 text-purple-800' :
            application.status === 'selected' ? 'bg-green-100 text-green-800' :
            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {application.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {studentProfile?.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {studentProfile?.phone || 'N/A'}</p>
              {student?.education && (
                <p><strong>Education:</strong> {student.education}</p>
              )}
              {student?.skills && student.skills.length > 0 && (
                <div>
                  <strong>Skills:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {student.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {student?.resume_url && (
                <a
                  href={student.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mt-2"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Resume
                </a>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Applied:</strong> {formatDate(application.applied_at)}</p>
              <p><strong>Last Updated:</strong> {formatDate(application.updated_at)}</p>
              {application.interviews && application.interviews.length > 0 && (
                <div>
                  <strong>Interviews:</strong>
                  <ul className="mt-1 space-y-1">
                    {application.interviews.map((interview: any) => (
                      <li key={interview.id} className="text-gray-600">
                        Round {interview.round_number}: {formatDateTime(interview.scheduled_at)}
                        {interview.meeting_link && (
                          <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600">
                            Join
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            {['shortlisted', 'interview_scheduled', 'selected'].includes(application.status) && (
              <Link
                href={`/dashboard/applicants/${application.id}/chat`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            )}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </button>
            {(application.status === 'selected' || application.status === 'rejected') && (
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {application.feedback ? 'Update Feedback' : 'Submit Feedback'}
              </button>
            )}
          </div>
        </div>

        {application.feedback && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Feedback</h2>
            <div className="space-y-2 text-sm">
              {application.feedback.selection_reasoning && (
                <div>
                  <strong>Selection Reasoning:</strong>
                  <p className="text-gray-600 mt-1">{application.feedback.selection_reasoning}</p>
                </div>
              )}
              <div>
                <strong>General Feedback:</strong>
                <p className="text-gray-600 mt-1">{application.feedback.general_feedback}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Interview</h3>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Round Number *
                </label>
                <input
                  type="number"
                  value={interviewData.round_number}
                  onChange={(e) => setInterviewData({ ...interviewData, round_number: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={interviewData.scheduled_at}
                  onChange={(e) => setInterviewData({ ...interviewData, scheduled_at: e.target.value })}
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={interviewData.duration_minutes}
                  onChange={(e) => setInterviewData({ ...interviewData, duration_minutes: e.target.value })}
                  required
                  min="15"
                  step="15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (optional)
                </label>
                <input
                  type="url"
                  value={interviewData.meeting_link}
                  onChange={(e) => setInterviewData({ ...interviewData, meeting_link: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Scheduling...' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit Feedback</h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selection Reasoning (optional)
                </label>
                <textarea
                  value={feedbackData.selection_reasoning}
                  onChange={(e) => setFeedbackData({ ...feedbackData, selection_reasoning: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  General Feedback *
                </label>
                <textarea
                  value={feedbackData.general_feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, general_feedback: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}