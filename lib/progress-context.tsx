'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

const SUPABASE_URL = 'https://cfwocsqltypzuuxlofdu.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmd29jc3FsdHlwenV1eGxvZmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzM1MDksImV4cCI6MjA5MzU0OTUwOX0.9Xa_PtYTsP2rRY2VbvOLwIm9A-RX6XgC1k3HMR37_S4';

export type Progress = {
  lessons: Record<string, boolean>;
  activity: Record<string, boolean>;
};

type SyncState = 'loading' | 'synced' | 'saving' | 'error';

type ProgressContextValue = {
  progress: Progress;
  syncState: SyncState;
  toggleLesson: (day: number) => void;
  toggleActivity: (iso: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

const EMPTY: Progress = { lessons: {}, activity: {} };

let sb: SupabaseClient | null = null;
try {
  sb = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch {
  sb = null;
}

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
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const local = readLocal();
    setProgress(local);

    (async () => {
      if (!sb) {
        setSyncState('error');
        return;
      }
      try {
        const { data, error } = await sb
          .from('eng_progress')
          .select('data,updated_at')
          .eq('id', 'main')
          .single();
        if (!error && data) {
          const localTs = window.localStorage.getItem('eng-progress-ts');
          const remoteTs = data.updated_at as string | null;
          if (!localTs || (remoteTs && new Date(remoteTs) > new Date(localTs))) {
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
  }, []);

  function pushRemote(next: Progress) {
    setSyncState('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!sb) {
        setSyncState('error');
        return;
      }
      const ts = new Date().toISOString();
      try {
        const { error } = await sb.from('eng_progress').upsert({ id: 'main', data: next, updated_at: ts });
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
