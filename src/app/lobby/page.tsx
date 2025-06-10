import { Suspense } from 'react';
import LobbyPage from '@/pages/LobbyPage';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Lobby() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LobbyPage />
    </Suspense>
  );
} 