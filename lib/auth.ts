import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const user = await getUser();
  
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(allowedRoles: ('student' | 'company' | 'admin')[]) {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile();
  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/');
  }

  return { user, profile };
}

export async function checkAdmin() {
  const user = await getUser();
  if (!user) return false;

  const profile = await getProfile();
  if (!profile) return false;

  // Check environment variable for admin email
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email === adminEmail) {
    // Update profile role to admin if not already
    if (profile.role !== 'admin') {
      const supabase = await createClient();
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);
    }
    return true;
  }

  return profile.role === 'admin';
}
