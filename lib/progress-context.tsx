'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export type Progress = {
  lessons: Record<string, boolean>;
  activity: Record<string, boolean>;
};

type SyncState = 'loading' | 'synced' | 'saving' | 'error' | 'signed-out';

type ProgressContextValue = {
  progress: Progress;
  syncState: SyncState;
  toggleLesson: (day: number) => void;
  toggleActivity: (iso: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const EMPTY: Progress = { lessons: {}, activity: {} };

function readLocal(): Progress {
  try {
    const raw = window.localStorage.getItem('eng-progress');
    if (raw) {
      const parsed = JSON.parse(raw);
      return { lessons: parsed.lessons || {}, activity: parsed.activity || {} };
    }
  } catch {
    /* ignore */
  }
  return { ...EMPTY };
}
function writeLocal(p: Progress) {
  try {
    window.localStorage.setItem('eng-progress', JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [syncState, setSyncState] = useState<SyncState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [supabase] = useState(() => createClient());
  const didInitLocal = useRef(false);

  // load the local cache immediately so the UI never waits on the network
  useEffect(() => {
    if (didInitLocal.current) return;
    didInitLocal.current = true;
    setProgress(readLocal());
  }, []);

  // track auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // signed in -> pull + merge remote (own row only, via RLS)
  useEffect(() => {
    if (!user) {
      setSyncState('signed-out');
      return;
    }
    (async () => {
      setSyncState('loading');
      try {
        const { data, error } = await supabase
          .from('eng_progress')
          .select('data,updated_at')
          .eq('user_id', user.id)
          .maybeSingle();
        if (!error) {
          const localTs = window.localStorage.getItem('eng-progress-ts');
          const remoteTs = data?.updated_at as string | undefined;
          if (data && (!localTs || (remoteTs && new Date(remoteTs) > new Date(localTs)))) {
            const remote = (data.data as Progress) || { ...EMPTY };
            const merged = { lessons: remote.lessons || {}, activity: remote.activity || {} };
            setProgress(merged);
            writeLocal(merged);
            if (remoteTs) window.localStorage.setItem('eng-progress-ts', remoteTs);
          }
        }
        setSyncState('synced');
      } catch {
        setSyncState('error');
      }
    })();
  }, [user, supabase]);

  function pushRemote(next: Progress) {
    if (!user) return; // not signed in: local-only, nothing to push
    setSyncState('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const ts = new Date().toISOString();
      try {
        const { error } = await supabase
          .from('eng_progress')
          .upsert({ user_id: user.id, data: next, updated_at: ts });
        if (error) throw error;
        window.localStorage.setItem('eng-progress-ts', ts);
        setSyncState('synced');
      } catch {
        setSyncState('error');
      }
    }, 500);
  }

  function toggleLesson(day: number) {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        lessons: { ...prev.lessons, [String(day)]: !prev.lessons[String(day)] },
      };
      writeLocal(next);
      pushRemote(next);
      return next;
    });
  }

  function toggleActivity(iso: string) {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        activity: { ...prev.activity, [iso]: !prev.activity[iso] },
      };
      writeLocal(next);
      pushRemote(next);
      return next;
    });
  }

  return (
    <ProgressContext.Provider value={{ progress, syncState, toggleLesson, toggleActivity }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
