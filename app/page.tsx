'use client';

import Heatmap from '@/components/Heatmap';
import { useProgress } from '@/lib/progress-context';
import lessons from '@/data/lessons.json';

export default function HomePage() {
  const { progress, syncState } = useProgress();
  const done = lessons.filter((l) => progress.lessons[String(l.day)]).length;

  return (
    <section>
      <h2>Workplace English — B1 → B2</h2>
      <p className="sub">Senior frontend developer · target: confident B2, exam in December</p>
      <div className="chips">
        <span className="chip">103 speaking topics</span>
        <span className="chip">46 lessons · Oct–Nov</span>
        <span className="chip">2h / day · Mon–Fri</span>
        <span className="chip">December: exam polish</span>
        <span className="chip">
          {done}/{lessons.length} done
        </span>
      </div>

      <h3 className="section-label">Activity</h3>
      <div className="sync-line">
        <span
          className={
            'sync-dot' + (syncState === 'synced' ? ' ok' : syncState === 'error' ? ' err' : '')
          }
        />
        <span>
          {syncState === 'synced'
            ? 'synced'
            : syncState === 'saving'
            ? 'saving…'
            : syncState === 'error'
            ? 'offline — saved locally only'
            : syncState === 'signed-out'
            ? 'not signed in — saved locally only'
            : 'loading…'}
        </span>
      </div>
      <Heatmap />
    </section>
  );
}
