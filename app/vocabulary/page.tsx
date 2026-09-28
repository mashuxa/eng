'use client';

import { useProgress } from '@/lib/progress-context';
import vocabData from '@/data/vocabulary.json';
import WordImage from '@/components/WordImage';

type VocabRow = {
  word: string;
  translation: string | null;
  category: string;
  example: string | null;
  level: string | null;
};

const rows = vocabData as VocabRow[];

const CATEGORY_ORDER = [
  'Tech & Business',
  'Phrasal Verbs',
  'Expressions',
  'Standup Phrases',
  'Crisis & Incidents',
  'Linking Words',
];

export default function VocabularyPage() {
  const { progress, toggleWord } = useProgress();

  const byCategory = new Map<string, VocabRow[]>();
  rows.forEach((r) => {
    if (!byCategory.has(r.category)) byCategory.set(r.category, []);
    byCategory.get(r.category)!.push(r);
  });

  const categories = Array.from(byCategory.keys()).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  const totalKnown = rows.filter((r) => progress.words[`vocab:${r.word}`]).length;

  return (
    <section>
      <h2>Vocabulary</h2>
      <p className="sub">
        From the Notion Words database — {rows.length} words · {totalKnown}/{rows.length} known
      </p>

      {categories.map((cat) => {
        const items = byCategory.get(cat)!;
        const known = items.filter((r) => progress.words[`vocab:${r.word}`]).length;
        return (
          <div className="week" key={cat}>
            <div className="dates">
              {known}/{items.length} known
            </div>
            <h4>{cat}</h4>
            <ul className="vocab-list">
              {items.map((r) => {
                const k = `vocab:${r.word}`;
                const isKnown = !!progress.words[k];
                return (
                  <li key={r.word} className={'vocab-item' + (isKnown ? ' known' : '')}>
                    <WordImage imgKey={k} />
                    <span className="vocab-text">
                      <b>{r.word}</b>
                      {r.translation && <span className="vocab-meaning"> — {r.translation}</span>}
                      {r.example && <div className="vocab-example">{r.example}</div>}
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
          </div>
        );
      })}

      <div className="dec">
        <h3>Note on this list</h3>
        <p className="sub" style={{ marginBottom: 0 }}>
          This covers the curated categories from your Notion Words database (Phrasal Verbs, Standup
          Phrases, Tech &amp; Business, Crisis &amp; Incidents, Linking Words, Expressions). The
          workspace hit Notion&apos;s query limit while pulling the larger general-vocabulary bucket
          (~900 additional dictionary-style entries) — say the word and I&apos;ll finish syncing those in
          too.
        </p>
      </div>
    </section>
  );
}
