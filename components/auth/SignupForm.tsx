'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface SignupFormProps {
  role: 'student' | 'company';
}

export default function SignupForm({ role }: SignupFormProps) {
  const router = useRouter();
  const supabase = createClient(); // ✅ BROWSER CLIENT

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Student fields
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [studentIdDoc, setStudentIdDoc] = useState<File | null>(null);

  // Company fields
  const [companyName, setCompanyName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [website, setWebsite] = useState('');
  const [hrContact, setHrContact] = useState('');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const uploadFile = async (
    file: File,
    bucket: string,
    path: string
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up auth user
      const { data: authData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('User not created');

      const userId = authData.user.id;

      // 2. Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        full_name: fullName,
        phone: phone || null,
        role,
      });

      if (profileError) throw profileError;

      // 3. Role-specific tables
      if (role === 'student') {
        let resumeUrl: string | null = null;
        let studentIdDocUrl: string | null = null;

        if (resume) {
          resumeUrl = await uploadFile(resume, 'resumes', userId);
        }

        if (studentIdDoc) {
          studentIdDocUrl = await uploadFile(studentIdDoc, 'ids', userId);
        }

        const skillsArray = skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const { error: studentError } = await supabase.from('students').insert({
          profile_id: userId,
          education: education || null,
          skills: skillsArray,
          resume_url: resumeUrl,
          student_id_doc_url: studentIdDocUrl,
        });

        if (studentError) throw studentError;
      }

      if (role === 'company') {
        const { error: companyError } = await supabase.from('companies').insert({
          profile_id: userId,
          company_name: companyName,
          organization_type: organizationType || null,
          website: website || null,
          hr_contact: hrContact || null,
          verification_status: 'pending',
        });

        if (companyError) throw companyError;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Common fields */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Student-specific fields */}
      {role === 'student' && (
        <>
          <div>
            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
              Education
            </label>
            <input
              id="education"
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g., Bachelor of Computer Science"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated) *
            </label>
            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
              Resume (PDF) *
            </label>
            <input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setResume)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="studentIdDoc" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID Document (PDF, optional)
            </label>
            <input
              id="studentIdDoc"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, setStudentIdDoc)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {/* Company-specific fields */}
      {role === 'company' && (
        <>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Type
            </label>
            <input
              id="organizationType"
              type="text"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              placeholder="e.g., Private, Public, NGO"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="hrContact" className="block text-sm font-medium text-gray-700 mb-1">
              HR Contact Email
            </label>
            <input
              id="hrContact"
              type="email"
              value={hrContact}
              onChange={(e) => setHrContact(e.target.value)}
              placeholder="hr@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium mt-6"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
