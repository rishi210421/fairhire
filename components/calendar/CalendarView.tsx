'use client';

import { useState } from 'react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import type { Event } from '@/types/database';

interface CalendarViewProps {
  events: Event[];
  profileId: string;
}

export default function CalendarView({ events: initialEvents, profileId }: CalendarViewProps) {
  const [events, setEvents] = useState(initialEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'custom' as 'interview' | 'deadline' | 'custom',
    starts_at: '',
    ends_at: '',
  });

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('events')
        .insert({
          profile_id: profileId,
          title: newEvent.title,
          description: newEvent.description || null,
          event_type: newEvent.event_type,
          starts_at: newEvent.starts_at,
          ends_at: newEvent.ends_at || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setEvents([...events, data as Event]);
      setNewEvent({
        title: '',
        description: '',
        event_type: 'custom',
        starts_at: '',
        ends_at: '',
      });
      setShowAddModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('profile_id', profileId); // Ensure user can only delete their own events

      if (deleteError) throw deleteError;

      setEvents(events.filter(e => e.id !== eventId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete event');
    }
  };

  // Group events by date
  const eventsByDate: Record<string, Event[]> = {};
  events.forEach(event => {
    const date = new Date(event.starts_at).toDateString();
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  const sortedDates = Object.keys(eventsByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>

      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No events scheduled. Add an event to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formatDate(date)}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {eventsByDate[date].map((event) => (
                  <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.event_type === 'interview' ? 'bg-purple-100 text-purple-800' :
                            event.event_type === 'deadline' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.event_type}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 mb-2">{event.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDateTime(event.starts_at)}</span>
                          </div>
                          {event.ends_at && (
                            <div className="flex items-center">
                              <span>to {formatDateTime(event.ends_at)}</span>
                            </div>
                          )}
                        </div>
                        {event.metadata?.meeting_link && (
                          <div className="mt-2">
                            <a
                              href={event.metadata.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                      {event.event_type === 'custom' && !event.metadata?.interview_id && (
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="custom">Custom</option>
                  <option value="deadline">Deadline</option>
                  <option value="interview">Interview</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.starts_at}
                  onChange={(e) => setNewEvent({ ...newEvent, starts_at: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time (optional)
                </label>
                <input
                  type="datetime-local"
                  value={newEvent.ends_at}
                  onChange={(e) => setNewEvent({ ...newEvent, ends_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}