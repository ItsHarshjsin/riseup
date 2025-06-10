import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LobbyPage from '@/pages/LobbyPage';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <LobbyPage />
        </Suspense>
      </div>
    </main>
  );
} 