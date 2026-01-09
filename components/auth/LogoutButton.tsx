'use client';

import { useRouter } from 'next/navigation';
//import { createClient } from '@/lib/supabase/client';
import { supabase } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter();
//const supabase = createClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
    >
      Logout
    </button>
  );
}
