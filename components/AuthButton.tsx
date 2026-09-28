'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  if (loading) return <div className="auth-box" />;

  return (
    <div className="auth-box">
      {user ? (
        <>
          <span className="auth-email" title={user.email ?? ''}>
            {user.email}
          </span>
          <button className="auth-btn" onClick={signOut}>
            Sign out
          </button>
        </>
      ) : (
        <button className="auth-btn" onClick={signIn}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}
