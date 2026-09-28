'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

export type Goal = { start: string; end: string };

export type Progress = {
  lessons: Record<string, boolean>;
  activity: Record<string, boolean>;
  goal: Goal | null;
  words: Record<string, boolean>;
  images: Record<string, string>;
};

type ProgressContextValue = {
  progress: Progress;
  ready: boolean;
  toggleLesson: (day: number) => void;
  toggleActivity: (iso: string) => void;
  setGoal: (start: string, end: string) => void;
  clearGoal: () => void;
  toggleWord: (key: string) => void;
  wordsKnownForDay: (day: number, terms: string[]) => number;
  setImage: (key: string, url: string) => void;
  clearImage: (key: string) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const EMPTY: Progress = { lessons: {}, activity: {}, goal: null, words: {}, images: {} };
const KEY = 'eng-progress';

function readLocal(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        lessons: parsed.lessons || {},
        activity: parsed.activity || {},
        goal: parsed.goal || null,
        words: parsed.words || {},
        images: parsed.images || {},
      };
    }
  } catch {
    /* ignore */
  }
  return { ...EMPTY };
}

function writeLocal(p: Progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore — private mode / storage full, nothing else to do */
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    setProgress(readLocal());
    setReady(true);
  }, []);

  function update(mutator: (prev: Progress) => Progress) {
    setProgress((prev) => {
      const next = mutator(prev);
      writeLocal(next);
      return next;
    });
  }

  function toggleLesson(day: number) {
    update((prev) => ({
      ...prev,
      lessons: { ...prev.lessons, [String(day)]: !prev.lessons[String(day)] },
    }));
  }

  function toggleActivity(iso: string) {
    update((prev) => ({
      ...prev,
      activity: { ...prev.activity, [iso]: !prev.activity[iso] },
    }));
  }

  function setGoal(start: string, end: string) {
    update((prev) => ({ ...prev, goal: { start, end } }));
  }

  function clearGoal() {
    update((prev) => ({ ...prev, goal: null }));
  }

  function toggleWord(key: string) {
    update((prev) => ({
      ...prev,
      words: { ...prev.words, [key]: !prev.words[key] },
    }));
  }

  function wordsKnownForDay(day: number, terms: string[]) {
    return terms.filter((t) => progress.words[`${day}:${t}`]).length;
  }

  function setImage(key: string, url: string) {
    update((prev) => ({
      ...prev,
      images: { ...prev.images, [key]: url },
    }));
  }

  function clearImage(key: string) {
    update((prev) => {
      const images = { ...prev.images };
      delete images[key];
      return { ...prev, images };
    });
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        ready,
        toggleLesson,
        toggleActivity,
        setGoal,
        clearGoal,
        toggleWord,
        wordsKnownForDay,
        setImage,
        clearImage,
      }}
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
