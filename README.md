# FairHire - Transparent Internship & Job Platform

A production-ready full-stack web application built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication**: Role-based access (Student, Company, Admin)
- 📊 **Dashboards**: Tailored experiences for each user role
- 🔒 **Security**: Row Level Security (RLS) policies
- 💬 **Realtime**: Chat system with live updates
- 📈 **Analytics**: Bias insights and conversion funnels
- 📅 **Calendar**: Interview scheduling with conflict prevention
- 🧠 **Cognitive Load Optimizer**: Prevents application overload

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Language**: TypeScript
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd FairHire
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=admin@example.com
```

4. Set up the database:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase/schema.sql` first
   - Then run `supabase/rls_policies.sql` to set up security policies
   - Create storage buckets: `resumes`, `ids`, `offer_letters`
     - Go to Storage in Supabase dashboard
     - Create each bucket with public access disabled (we use signed URLs)

5. Enable Realtime:
   - Go to Database → Replication in Supabase dashboard
   - Enable replication for the `messages` table

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Seed Data

After setting up the database, you can create test users:

1. Create users via Supabase Auth UI or API
2. Update `supabase/seed.sql` with actual user UUIDs
3. Run the seed script from Supabase SQL Editor

Alternatively, use the signup flow in the application to create users naturally.

## Project Structure

```
FairHire/
├── app/                        # Next.js App Router
│   ├── admin/                  # Admin panel routes
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── applications/       # Student application pages
│   │   ├── applicants/         # Company applicant management
│   │   ├── calendar/           # Calendar page
│   │   ├── jobs/               # Job listings (student/company)
│   │   └── analytics/          # Company analytics
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                 # Reusable components
│   ├── admin/                  # Admin components
│   ├── analytics/             # Analytics components
│   ├── applicants/             # Applicant management
│   ├── applications/           # Application tracking
│   ├── auth/                   # Authentication components
│   ├── calendar/               # Calendar components
│   ├── chat/                   # Chat components
│   ├── dashboard/              # Dashboard components
│   └── jobs/                   # Job-related components
├── lib/                        # Utilities and helpers
│   ├── auth.ts                 # Authentication helpers
│   ├── company-utils.ts        # Company-specific utilities
│   ├── student-utils.ts        # Student-specific utilities
│   ├── utils.ts                # General utilities
│   └── supabase/               # Supabase client configuration
├── types/                      # TypeScript types
│   └── database.ts             # Database type definitions
└── supabase/                   # Database schemas and migrations
    ├── schema.sql              # Database schema
    ├── rls_policies.sql        # Row Level Security policies
    └── seed.sql                # Seed data (example)
```

## Key Features

### Student Features
- Browse and apply to jobs
- Skill-based job recommendations
- Application tracking with status updates
- Calendar for interviews and deadlines
- Chat with companies (after shortlisting)
- Cognitive load optimizer prevents over-application
- View feedback after final decisions

### Company Features
- Job posting and management
- Applicant pipeline management
- Interview scheduling with conflict prevention
- Chat with applicants (after shortlisting)
- Analytics and bias insights
- Feedback submission (mandatory before closing)

### Admin Features
- Company verification (approve/reject)
- Global metrics dashboard
- View all companies, jobs, and applications
- Access via ADMIN_EMAIL environment variable only

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Role-based access control**: Students, Companies, and Admins have different access levels
- **Secure file uploads**: Uses Supabase Storage with signed URLs
- **Admin access**: Only via ADMIN_EMAIL environment variable
- **Data isolation**: Users can only access their own data or data they're authorized to see

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
4. Deploy

The project is configured for Vercel deployment out of the box.

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)
- `ADMIN_EMAIL`: Email address for admin access

## Cognitive Load Optimizer

The system tracks:
- Active applications (max 10)
- Upcoming deadlines within 7 days (max 5)
- Scheduled interviews (max 5)

If thresholds are exceeded, the system:
- Shows a warning to the student
- Automatically freezes new applications for 7 days
- Stores freeze_until timestamp

## Bias Analytics

The analytics engine computes:
- Branch/education vs selection ratio
- Stage-wise dropouts
- Company conversion funnel
- Application status distribution

Visible in company dashboard and admin panel with charts.

## License

MIT