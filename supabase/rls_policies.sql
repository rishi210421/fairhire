-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get company_id from profile
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT id FROM companies WHERE profile_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get student_id from profile
CREATE OR REPLACE FUNCTION get_user_student_id()
RETURNS UUID AS $$
  SELECT id FROM students WHERE profile_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Anyone can insert during signup
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- COMPANIES POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all companies"
  ON companies FOR SELECT
  USING (is_admin());

-- Admins can update all
CREATE POLICY "Admins can update all companies"
  ON companies FOR UPDATE
  USING (is_admin());

-- Companies can read their own
CREATE POLICY "Companies can read own company"
  ON companies FOR SELECT
  USING (profile_id = auth.uid());

-- Companies can update their own
CREATE POLICY "Companies can update own company"
  ON companies FOR UPDATE
  USING (profile_id = auth.uid());

-- Anyone can see approved companies
CREATE POLICY "Anyone can see approved companies"
  ON companies FOR SELECT
  USING (verification_status = 'approved');

-- Companies can insert during signup
CREATE POLICY "Companies can insert own company"
  ON companies FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- STUDENTS POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all students"
  ON students FOR SELECT
  USING (is_admin());

-- Students can read their own
CREATE POLICY "Students can read own student"
  ON students FOR SELECT
  USING (profile_id = auth.uid());

-- Students can update their own
CREATE POLICY "Students can update own student"
  ON students FOR UPDATE
  USING (profile_id = auth.uid());

-- Companies can read students who applied to their jobs
CREATE POLICY "Companies can read applicants"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.student_id = students.id
      AND c.profile_id = auth.uid()
    )
  );

-- Students can insert during signup
CREATE POLICY "Students can insert own student"
  ON students FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- JOBS POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all jobs"
  ON jobs FOR SELECT
  USING (is_admin());

-- Anyone can read active jobs (students need this)
CREATE POLICY "Anyone can read active jobs"
  ON jobs FOR SELECT
  USING (
    status = 'active' 
    AND deadline > NOW()
    AND EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = jobs.company_id
      AND c.verification_status = 'approved'
    )
  );

-- Companies can read their own jobs
CREATE POLICY "Companies can read own jobs"
  ON jobs FOR SELECT
  USING (company_id = get_user_company_id());

-- Companies can insert their own jobs
CREATE POLICY "Companies can insert own jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    company_id = get_user_company_id()
    AND EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = company_id
      AND c.verification_status = 'approved'
    )
  );

-- Companies can update their own jobs
CREATE POLICY "Companies can update own jobs"
  ON jobs FOR UPDATE
  USING (company_id = get_user_company_id());

-- Admins can update all jobs
CREATE POLICY "Admins can update all jobs"
  ON jobs FOR UPDATE
  USING (is_admin());

-- APPLICATIONS POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all applications"
  ON applications FOR SELECT
  USING (is_admin());

-- Students can read their own applications
CREATE POLICY "Students can read own applications"
  ON applications FOR SELECT
  USING (student_id = get_user_student_id());

-- Companies can read applications to their jobs
CREATE POLICY "Companies can read job applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = applications.job_id
      AND j.company_id = get_user_company_id()
    )
  );

-- Students can insert their own applications
CREATE POLICY "Students can insert own applications"
  ON applications FOR INSERT
  WITH CHECK (
    student_id = get_user_student_id()
    AND EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = job_id
      AND j.status = 'active'
      AND j.deadline > NOW()
      AND (
        SELECT COUNT(*) FROM applications a
        WHERE a.job_id = j.id
      ) < j.applicant_limit
    )
    AND NOT EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_id
      AND s.freeze_until > NOW()
    )
  );

-- Companies can update applications to their jobs
CREATE POLICY "Companies can update job applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = applications.job_id
      AND j.company_id = get_user_company_id()
    )
  );

-- INTERVIEWS POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all interviews"
  ON interviews FOR SELECT
  USING (is_admin());

-- Students can read interviews for their applications
CREATE POLICY "Students can read own interviews"
  ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = interviews.application_id
      AND a.student_id = get_user_student_id()
    )
  );

-- Companies can read interviews for their job applications
CREATE POLICY "Companies can read job interviews"
  ON interviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = interviews.application_id
      AND j.company_id = get_user_company_id()
    )
  );

-- Companies can insert interviews for their job applications
CREATE POLICY "Companies can insert job interviews"
  ON interviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = application_id
      AND j.company_id = get_user_company_id()
    )
    AND NOT EXISTS (
      SELECT 1 FROM interviews i
      JOIN applications a ON i.application_id = a.id
      WHERE a.student_id = (
        SELECT student_id FROM applications WHERE id = interviews.application_id
      )
      AND i.scheduled_at = interviews.scheduled_at
      AND i.id != interviews.id
    )
  );

-- Companies can update interviews for their job applications
CREATE POLICY "Companies can update job interviews"
  ON interviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = interviews.application_id
      AND j.company_id = get_user_company_id()
    )
  );

-- MESSAGES POLICIES
-- Users can read messages where they are sender or receiver
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid() 
    OR receiver_id = auth.uid()
    OR is_admin()
  );

-- Users can insert messages where they are sender
CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1 FROM applications a
        WHERE a.id = application_id
        AND (
          (a.student_id = get_user_student_id() AND receiver_id IN (
            SELECT c.profile_id FROM jobs j
            JOIN companies c ON j.company_id = c.id
            WHERE j.id = a.job_id
          ))
          OR (
            receiver_id = (
              SELECT s.profile_id FROM applications a2
              JOIN students s ON a2.student_id = s.id
              WHERE a2.id = application_id
            )
            AND EXISTS (
              SELECT 1 FROM applications a3
              JOIN jobs j ON a3.job_id = j.id
              JOIN companies c ON j.company_id = c.id
              WHERE a3.id = application_id
              AND c.profile_id = auth.uid()
              AND a3.status IN ('shortlisted', 'interview_scheduled', 'selected')
            )
          )
        )
      )
    )
  );

-- Users can update messages where they are receiver (mark as read)
CREATE POLICY "Users can update received messages"
  ON messages FOR UPDATE
  USING (receiver_id = auth.uid());

-- FEEDBACK POLICIES
-- Admins can read all
CREATE POLICY "Admins can read all feedback"
  ON feedback FOR SELECT
  USING (is_admin());

-- Students can read feedback for their applications
CREATE POLICY "Students can read own feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = feedback.application_id
      AND a.student_id = get_user_student_id()
    )
  );

-- Companies can read and insert feedback for their job applications
CREATE POLICY "Companies can manage job feedback"
  ON feedback FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = feedback.application_id
      AND j.company_id = get_user_company_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = feedback.application_id
      AND j.company_id = get_user_company_id()
    )
  );

-- EVENTS POLICIES
-- Users can read their own events
CREATE POLICY "Users can read own events"
  ON events FOR SELECT
  USING (
    profile_id = auth.uid()
    OR is_admin()
  );

-- Users can insert their own events
CREATE POLICY "Users can insert own events"
  ON events FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Users can update their own events
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (profile_id = auth.uid());

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (profile_id = auth.uid());
