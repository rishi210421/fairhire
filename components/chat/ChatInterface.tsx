'use client';

import { useState, useEffect, useRef } from 'react';
import { formatDateTime } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
  };
  receiver?: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface ChatInterfaceProps {
  applicationId: string;
  senderId: string;
  receiverId: string;
  initialMessages: Message[];
}

export default function ChatInterface({ applicationId, senderId, receiverId, initialMessages }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          // Fetch the full message with sender/receiver info
          supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey (
                id,
                full_name,
                email
              ),
              receiver:profiles!messages_receiver_id_fkey (
                id,
                full_name,
                email
              )
            `)
            .eq('id', payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages((prev) => [...prev, data as Message]);
              }
            });
        }
      )
      .subscribe();

    // Mark messages as read
    supabase
      .from('messages')
      .update({ read: true })
      .eq('application_id', applicationId)
      .eq('receiver_id', senderId)
      .eq('read', false);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [applicationId, senderId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          application_id: applicationId,
          sender_id: senderId,
          receiver_id: receiverId,
          content: newMessage.trim(),
        });

      if (insertError) throw insertError;

      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col" style={{ height: '600px' }}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-t-lg">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isSent = message.sender_id === senderId;
            return (
              <div
                key={message.id}
                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isSent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {!isSent && (
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.sender?.full_name || 'Unknown'}
                    </div>
                  )}
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${isSent ? 'text-indigo-100' : 'text-gray-500'}`}>
                    {formatDateTime(message.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}