# FairHire Setup Checklist

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Git repository initialized (optional)

## Supabase Setup

### 1. Create Supabase Project
- [ ] Create a new project in Supabase
- [ ] Note down your project URL and API keys

### 2. Database Setup
- [ ] Go to SQL Editor in Supabase Dashboard
- [ ] Run `supabase/schema.sql` - Creates all tables and types
- [ ] Run `supabase/rls_policies.sql` - Sets up Row Level Security

### 3. Storage Setup
- [ ] Go to Storage in Supabase Dashboard
- [ ] Create bucket: `resumes`
  - Make it private (not public)
  - Enable file uploads
- [ ] Create bucket: `ids`
  - Make it private (not public)
  - Enable file uploads
- [ ] Create bucket: `offer_letters`
  - Make it private (not public)
  - Enable file uploads

### 4. Realtime Setup
- [ ] Go to Database → Replication in Supabase Dashboard
- [ ] Enable replication for `messages` table
  - This enables real-time chat updates

### 5. Storage Policies (RLS)
The storage buckets should have RLS policies. You can set these up via SQL:

```sql
-- Allow users to upload their own resumes
CREATE POLICY "Users can upload own resume"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own resumes
CREATE POLICY "Users can read own resume"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'resumes' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Similar policies for 'ids' bucket
CREATE POLICY "Users can upload own ID"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read own ID"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'ids' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## Application Setup

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in the following:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ADMIN_EMAIL=your_admin_email@example.com
  ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

- [ ] Verify the app runs at http://localhost:3000

### 4. Test Authentication
- [ ] Create a student account via signup
- [ ] Create a company account via signup
- [ ] Login as admin (using ADMIN_EMAIL) to verify admin panel access

### 5. Verify Admin Access
- [ ] Login with ADMIN_EMAIL
- [ ] Verify you're redirected to `/admin`
- [ ] Verify you can see pending companies
- [ ] Approve a test company

### 6. Test Company Verification
- [ ] Login as the company you just approved
- [ ] Verify the verification pending screen is gone
- [ ] Verify you can post jobs

## Production Deployment (Vercel)

### 1. Prepare for Deployment
- [ ] Push code to GitHub
- [ ] Verify all environment variables are set locally

### 2. Deploy to Vercel
- [ ] Import project in Vercel
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_EMAIL`
- [ ] Deploy

### 3. Post-Deployment
- [ ] Verify production site works
- [ ] Test authentication on production
- [ ] Test file uploads on production
- [ ] Test admin access on production

## Testing Checklist

### Student Features
- [ ] Sign up as student
- [ ] Upload resume
- [ ] Browse jobs
- [ ] Apply to a job
- [ ] View application status
- [ ] Add calendar events
- [ ] View cognitive load indicator

### Company Features
- [ ] Sign up as company
- [ ] Wait for admin verification (or approve yourself)
- [ ] Post a job
- [ ] View applicants
- [ ] Shortlist an applicant
- [ ] Schedule an interview
- [ ] Chat with applicant
- [ ] Submit feedback
- [ ] View analytics

### Admin Features
- [ ] Login with admin email
- [ ] View pending companies
- [ ] Approve a company
- [ ] Reject a company
- [ ] View global metrics
- [ ] View all jobs and applications

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- Solution: Check `.env.local` file exists and has all required variables

### Issue: "Row Level Security policy violation"
- Solution: Verify RLS policies are applied correctly via `supabase/rls_policies.sql`

### Issue: "Storage bucket not found"
- Solution: Verify storage buckets are created and named correctly (`resumes`, `ids`, `offer_letters`)

### Issue: "Chat not working (no real-time updates)"
- Solution: Enable replication for `messages` table in Supabase Dashboard

### Issue: "Admin redirect not working"
- Solution: Verify `ADMIN_EMAIL` environment variable matches the email you're using to login

## Security Notes

1. **Never commit `.env.local`** to version control
2. **ADMIN_EMAIL** should be a secure email address
3. **SUPABASE_SERVICE_ROLE_KEY** should never be exposed to clients
4. **RLS policies** are critical - test them thoroughly
5. **Storage buckets** should be private, not public

## Next Steps

After setup, consider:
- Setting up email notifications (via Supabase Auth)
- Customizing branding and styling
- Adding more analytics features
- Setting up automated backups
- Configuring error tracking (e.g., Sentry)