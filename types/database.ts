export type UserRole = 'student' | 'company' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type ApplicationStatus = 
  | 'applied'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'rejected'
  | 'selected'
  | 'offer_verified';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  profile_id: string;
  company_name: string;
  organization_type: string | null;
  website: string | null;
  hr_contact: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  education: string | null;
  skills: string[];
  resume_url: string | null;
  student_id_doc_url: string | null;
  freeze_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
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
  // Joined data
  company?: Company;
  application_count?: number;
}

export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  // Joined data
  job?: Job;
  student?: Student;
  interviews?: Interview[];
  feedback?: Feedback;
}

export interface Interview {
  id: string;
  application_id: string;
  round_number: number;
  scheduled_at: string;
  duration_minutes: number;
  meeting_link: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  // Joined data
  sender?: Profile;
  receiver?: Profile;
}

export interface Feedback {
  id: string;
  application_id: string;
  selection_reasoning: string | null;
  general_feedback: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  event_type: 'interview' | 'deadline' | 'custom';
  starts_at: string;
  ends_at: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
