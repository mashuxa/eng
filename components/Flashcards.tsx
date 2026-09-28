'use client';

import { useState } from 'react';
import { useProgress } from '@/lib/progress-context';
import WordImage from '@/components/WordImage';

type Word = { term: string; meaning: string };

export default function Flashcards({ day, words }: { day: number; words: Word[] }) {
  const { progress, toggleWord } = useProgress();
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const w = words[i];
  const key = `${day}:${w.term}`;
  const known = !!progress.words[key];

  function go(delta: number) {
    setFlipped(false);
    setI((prev) => (prev + delta + words.length) % words.length);
  }

  function mark(value: boolean) {
    if (known !== value) toggleWord(key);
    go(1);
  }

  return (
    <div className="flashcards">
      <div className="flash-progress">
        {words.map((word, idx) => (
          <span
            key={word.term}
            className={'flash-dot' + (idx === i ? ' active' : '') + (progress.words[`${day}:${word.term}`] ? ' known' : '')}
          />
        ))}
      </div>

      <div className={'flashcard' + (flipped ? ' flipped' : '')} onClick={() => setFlipped((f) => !f)}>
        <div className="flashcard-inner">
          <div className="flashcard-face flashcard-front">
            <WordImage imgKey={key} size="lg" />
            <div className="flash-term">{w.term}</div>
            <div className="flash-hint">tap to flip</div>
          </div>
          <div className="flashcard-face flashcard-back">
            <div className="flash-meaning">{w.meaning}</div>
          </div>
        </div>
      </div>

      <div className="flash-controls">
        <button className="link-btn" onClick={() => go(-1)}>
          ← prev
        </button>
        <span className="flash-count">
          {i + 1} / {words.length}
        </span>
        <button className="link-btn" onClick={() => go(1)}>
          next →
        </button>
      </div>

      <div className="flash-actions">
        <button className="flash-btn flash-btn-no" onClick={() => mark(false)}>
          still learning
        </button>
        <button className="flash-btn flash-btn-yes" onClick={() => mark(true)}>
          I know this ✓
        </button>
      </div>
    </div>
  );
}
