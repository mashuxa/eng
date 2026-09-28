'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export type Goal = { start: string; end: string };

export type Progress = {
  lessons: Record<string, boolean>;
  activity: Record<string, boolean>;
  goal: Goal | null;
};

type SyncState = 'loading' | 'synced' | 'saving' | 'error' | 'signed-out';

type ProgressContextValue = {
  progress: Progress;
  syncState: SyncState;
  isSignedIn: boolean;
  toggleLesson: (day: number) => void;
  toggleActivity: (iso: string) => void;
  setGoal: (start: string, end: string) => void;
  clearGoal: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const EMPTY: Progress = { lessons: {}, activity: {}, goal: null };

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [syncState, setSyncState] = useState<SyncState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [supabase] = useState(() => createClient());

  // track auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthResolved(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // signed in -> load from db (source of truth). signed out -> nothing is saved, nothing to show.
  useEffect(() => {
    if (!authResolved) return;
    if (!user) {
      setProgress(EMPTY);
      setSyncState('signed-out');
      return;
    }
    (async () => {
      setSyncState('loading');
      try {
        const { data, error } = await supabase
          .from('eng_progress')
          .select('data')
          .eq('user_id', user.id)
          .maybeSingle();
        if (!error && data) {
          const remote = (data.data as Progress) || { ...EMPTY };
          setProgress({
            lessons: remote.lessons || {},
            activity: remote.activity || {},
            goal: remote.goal || null,
          });
        } else {
          setProgress(EMPTY);
        }
        setSyncState('synced');
      } catch {
        setSyncState('error');
      }
    })();
  }, [user, authResolved, supabase]);

  function pushRemote(next: Progress) {
    if (!user) return;
    setSyncState('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('eng_progress')
          .upsert({ user_id: user.id, data: next, updated_at: new Date().toISOString() });
        if (error) throw error;
        setSyncState('synced');
      } catch {
        setSyncState('error');
      }
    }, 500);
  }

  function toggleLesson(day: number) {
    if (!user) return; // signed out: nothing is saved
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        lessons: { ...prev.lessons, [String(day)]: !prev.lessons[String(day)] },
      };
      pushRemote(next);
      return next;
    });
  }

  function toggleActivity(iso: string) {
    if (!user) return; // signed out: nothing is saved
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        activity: { ...prev.activity, [iso]: !prev.activity[iso] },
      };
      pushRemote(next);
      return next;
    });
  }

  function setGoal(start: string, end: string) {
    if (!user) return;
    setProgress((prev) => {
      const next: Progress = { ...prev, goal: { start, end } };
      pushRemote(next);
      return next;
    });
  }

  function clearGoal() {
    if (!user) return;
    setProgress((prev) => {
      const next: Progress = { ...prev, goal: null };
      pushRemote(next);
      return next;
    });
  }

  return (
    <ProgressContext.Provider
      value={{ progress, syncState, isSignedIn: !!user, toggleLesson, toggleActivity, setGoal, clearGoal }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
