'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/progress-context';
import Flashcards from '@/components/Flashcards';

export type VocabItem = { term: string; meaning: string };

export type Lesson = {
  day: number;
  date: string;
  weekday: string;
  week: string;
  grammar: string;
  domain: string;
  scenario: string;
  vocab: VocabItem[];
  tasks: string[];
};

function fmtDate(iso: string) {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

type Tab = 'vocab' | 'cards' | 'tasks';

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const { progress, toggleLesson, toggleWord, wordsKnownForDay } = useProgress();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('vocab');

  const done = !!progress.lessons[String(lesson.day)];
  const terms = lesson.vocab.map((v) => v.term);
  const known = wordsKnownForDay(lesson.day, terms);

  return (
    <div className={'lesson-card' + (done ? ' done' : '')}>
      <div className="lesson-header" onClick={() => setOpen((o) => !o)}>
        <input
          type="checkbox"
          checked={done}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleLesson(lesson.day)}
        />
        <span className="lesson-day">Day {lesson.day}</span>
        <span className="lesson-date">
          {fmtDate(lesson.date)} · {lesson.weekday}
        </span>
        <span className="lesson-grammar">{lesson.grammar}</span>
        <span className="lesson-domain">
          {lesson.domain} — {lesson.scenario}
        </span>
        <span className="lesson-words-badge" title="words marked as known">
          {known}/{terms.length} words
        </span>
        <span className={'chevron' + (open ? ' open' : '')}>▾</span>
      </div>

      {open && (
        <div className="lesson-body">
          <div className="tabs">
            <button className={'tab-btn' + (tab === 'vocab' ? ' active' : '')} onClick={() => setTab('vocab')}>
              📖 Vocabulary
            </button>
            <button className={'tab-btn' + (tab === 'cards' ? ' active' : '')} onClick={() => setTab('cards')}>
              🃏 Flashcards
            </button>
            <button className={'tab-btn' + (tab === 'tasks' ? ' active' : '')} onClick={() => setTab('tasks')}>
              ✅ Tasks
            </button>
          </div>

          {tab === 'vocab' && (
            <ul className="vocab-list">
              {lesson.vocab.map((v) => {
                const k = `${lesson.day}:${v.term}`;
                const isKnown = !!progress.words[k];
                return (
                  <li key={v.term} className={'vocab-item' + (isKnown ? ' known' : '')}>
                    <span className="vocab-text">
                      <b>{v.term}</b>
                      <span className="vocab-meaning"> — {v.meaning}</span>
                    </span>
                    <button
                      className={'know-btn' + (isKnown ? ' active' : '')}
                      onClick={() => toggleWord(k)}
                      title="mark as known"
                    >
                      {isKnown ? '✓' : '○'}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {tab === 'cards' && <Flashcards day={lesson.day} words={lesson.vocab} />}

          {tab === 'tasks' && (
            <ol className="task-list">
              {lesson.tasks.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
