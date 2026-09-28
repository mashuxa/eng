'use client';

import { useEffect, useState } from 'react';
import Heatmap from '@/components/Heatmap';
import { useProgress } from '@/lib/progress-context';
import lessons from '@/data/lessons.json';

export default function HomePage() {
  const { progress, syncState, isSignedIn, setGoal } = useProgress();
  const done = lessons.filter((l) => progress.lessons[String(l.day)]).length;

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (progress.goal) {
      setStart(progress.goal.start);
      setEnd(progress.goal.end);
    }
  }, [progress.goal]);

  function saveGoal() {
    if (!start || !end || end < start) return;
    setGoal(start, end);
    setEditing(false);
  }

  const showForm = isSignedIn && (!progress.goal || editing);

  return (
    <section>
      <h2>Workplace English — B1 → B2</h2>
      <p className="sub">Senior frontend developer · target: confident B2, exam in December</p>
      <div className="chips">
        <span className="chip">103 speaking topics</span>
        <span className="chip">2h / day · Mon–Fri</span>
        <span className="chip">December: exam polish</span>
        <span className="chip">
          {done}/{lessons.length} done
        </span>
      </div>

      {!isSignedIn && (
        <div className="signin-banner">
          <b>Sign in to save progress</b>
          <span>Nothing is saved while you&apos;re signed out — use the button in the sidebar.</span>
        </div>
      )}

      {isSignedIn && (
        <>
          <h3 className="section-label">Activity</h3>

          {showForm ? (
            <div className="goal-form">
              <p className="sub" style={{ marginBottom: 12 }}>
                Set your study period to start tracking activity
              </p>
              <div className="goal-inputs">
                <label>
                  From
                  <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
                </label>
                <label>
                  To
                  <input type="date" value={end} min={start || undefined} onChange={(e) => setEnd(e.target.value)} />
                </label>
                <button className="auth-btn" onClick={saveGoal} disabled={!start || !end || end < start}>
                  Save
                </button>
                {progress.goal && (
                  <button className="link-btn" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
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
                    ? 'offline — try again in a moment'
                    : 'loading…'}
                </span>
                <button className="link-btn" onClick={() => setEditing(true)}>
                  edit dates
                </button>
              </div>
              {progress.goal && <Heatmap start={progress.goal.start} end={progress.goal.end} />}
            </>
          )}
        </>
      )}
    </section>
  );
}
