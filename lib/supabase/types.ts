// This file can be auto-generated from Supabase CLI
// For now, we'll define basic types that match our schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'student' | 'company' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'student' | 'company' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'student' | 'company' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          profile_id: string;
          company_name: string;
          organization_type: string | null;
          website: string | null;
          hr_contact: string | null;
          verification_status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          company_name: string;
          organization_type?: string | null;
          website?: string | null;
          hr_contact?: string | null;
          verification_status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          company_name?: string;
          organization_type?: string | null;
          website?: string | null;
          hr_contact?: string | null;
          verification_status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          profile_id: string;
          education: string | null;
          skills: string[];
          resume_url: string | null;
          student_id_doc_url: string | null;
          freeze_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          education?: string | null;
          skills?: string[];
          resume_url?: string | null;
          student_id_doc_url?: string | null;
          freeze_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          education?: string | null;
          skills?: string[];
          resume_url?: string | null;
          student_id_doc_url?: string | null;
          freeze_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          skills_required: string[];
          stipend: number;
          applicant_limit: number;
          deadline: string;
          status: 'active' | 'closed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          skills_required?: string[];
          stipend: number;
          applicant_limit: number;
          deadline: string;
          status?: 'active' | 'closed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string;
          skills_required?: string[];
          stipend?: number;
          applicant_limit?: number;
          deadline?: string;
          status?: 'active' | 'closed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          student_id: string;
          status: 'applied' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'selected' | 'offer_verified';
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          student_id: string;
          status?: 'applied' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'selected' | 'offer_verified';
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          student_id?: string;
          status?: 'applied' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'selected' | 'offer_verified';
          applied_at?: string;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          application_id: string;
          round_number: number;
          scheduled_at: string;
          duration_minutes: number;
          meeting_link: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          round_number?: number;
          scheduled_at: string;
          duration_minutes?: number;
          meeting_link?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          round_number?: number;
          scheduled_at?: string;
          duration_minutes?: number;
          meeting_link?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          application_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      feedback: {
        Row: {
          id: string;
          application_id: string;
          selection_reasoning: string | null;
          general_feedback: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          selection_reasoning?: string | null;
          general_feedback: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          selection_reasoning?: string | null;
          general_feedback?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          profile_id: string;
          title: string;
          description: string | null;
          event_type: 'interview' | 'deadline' | 'custom';
          starts_at: string;
          ends_at: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title: string;
          description?: string | null;
          event_type: 'interview' | 'deadline' | 'custom';
          starts_at: string;
          ends_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title?: string;
          description?: string | null;
          event_type?: 'interview' | 'deadline' | 'custom';
          starts_at?: string;
          ends_at?: string | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
