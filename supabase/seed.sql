-- Seed data for development/testing
-- IMPORTANT: This script assumes you have created auth users via Supabase Auth API first
-- The actual user IDs will need to be replaced with real UUIDs from auth.users

-- Instructions:
-- 1. First, create auth users via Supabase Auth UI or API
-- 2. Get the UUIDs from auth.users table
-- 3. Replace the UUIDs below with actual user IDs
-- 4. Run this script in Supabase SQL Editor

-- Example structure (replace UUIDs with actual user IDs):

/*
-- Demo Student Profile (replace student_uuid with actual auth user ID)
INSERT INTO profiles (id, email, full_name, phone, role)
VALUES (
  'student-uuid-here',  -- Replace with actual UUID from auth.users
  'student@demo.com',
  'John Student',
  '+1234567890',
  'student'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Student Record
INSERT INTO students (profile_id, education, skills, resume_url)
VALUES (
  (SELECT id FROM profiles WHERE email = 'student@demo.com'),
  'Bachelor of Computer Science',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
  'resumes/student-resume.pdf'
)
ON CONFLICT DO NOTHING;

-- Demo Company Profile (replace company_uuid with actual auth user ID)
INSERT INTO profiles (id, email, full_name, phone, role)
VALUES (
  'company-uuid-here',  -- Replace with actual UUID from auth.users
  'company@demo.com',
  'Jane HR Manager',
  '+1234567891',
  'company'
)
ON CONFLICT (id) DO NOTHING;

-- Demo Company Record
INSERT INTO companies (profile_id, company_name, organization_type, website, hr_contact, verification_status)
VALUES (
  (SELECT id FROM profiles WHERE email = 'company@demo.com'),
  'Tech Corp',
  'Private',
  'https://techcorp.com',
  'hr@techcorp.com',
  'approved'  -- Set to 'pending' if you want to test verification flow
)
ON CONFLICT DO NOTHING;

-- Demo Jobs
INSERT INTO jobs (company_id, title, description, skills_required, stipend, applicant_limit, deadline, status)
VALUES (
  (SELECT id FROM companies WHERE company_name = 'Tech Corp'),
  'Full Stack Developer Intern',
  'Join our team as a full-stack developer intern. Work on exciting projects using modern technologies like React, Node.js, and TypeScript. You will be part of a dynamic team building scalable web applications.',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL', 'MongoDB'],
  50000.00,
  10,
  NOW() + INTERVAL '30 days',
  'active'
),
(
  (SELECT id FROM companies WHERE company_name = 'Tech Corp'),
  'Frontend Developer Intern',
  'Looking for a frontend developer intern with React experience. You will work on building user interfaces and improving user experience. Knowledge of TypeScript and CSS is a plus.',
  ARRAY['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
  40000.00,
  5,
  NOW() + INTERVAL '20 days',
  'active'
),
(
  (SELECT id FROM companies WHERE company_name = 'Tech Corp'),
  'Backend Developer Intern',
  'We are seeking a backend developer intern to work on server-side logic, APIs, and database management. Experience with Node.js or Python is preferred.',
  ARRAY['Node.js', 'Python', 'SQL', 'REST APIs', 'MongoDB'],
  45000.00,
  8,
  NOW() + INTERVAL '25 days',
  'active'
)
ON CONFLICT DO NOTHING;

-- Note: Applications will be created when students apply through the app
-- Interviews and messages will be created through the app workflow
-- Feedback will be created when companies submit feedback through the app

-- To create test data more easily, you can use the Supabase Dashboard:
-- 1. Go to Authentication > Users and create users
-- 2. Note down their UUIDs
-- 3. Update this script with actual UUIDs
-- 4. Run the script

-- Alternative: Use the application signup flow to create users, then manually approve companies via admin panel
*/

-- Helper query to check existing data
-- SELECT p.email, p.role, c.company_name, c.verification_status 
-- FROM profiles p 
-- LEFT JOIN companies c ON c.profile_id = p.id 
-- LEFT JOIN students s ON s.profile_id = p.id;