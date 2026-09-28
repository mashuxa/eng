'use client';

import { useEffect, useRef } from 'react';
import { useProgress } from '@/lib/progress-context';

const MONTH_NAMES = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

type Cell = { iso: string; isFuture: boolean; isToday: boolean; isPadding: boolean };
type MonthLabel = { month: number; col: number };

function buildCells(startStr: string, endStr: string) {
  const realStart = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');

  // pad back to the Monday on/before the real start so weekday rows line up with the labels
  const dow0 = (realStart.getDay() + 6) % 7; // Mon=0..Sun=6
  const gridStart = new Date(realStart);
  gridStart.setDate(realStart.getDate() - dow0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  const cells: Cell[] = [];
  const monthLabels: MonthLabel[] = [];
  let d = new Date(gridStart);
  let dayIndex = 0;
  let lastMonth = -1;

  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    const dow = (d.getDay() + 6) % 7;
    const col = Math.floor(dayIndex / 7);
    if (dow === 0) {
      const m = d.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        monthLabels.push({ month: m, col });
      }
    }
    cells.push({
      iso,
      isFuture: d > today,
      isToday: iso === todayIso,
      isPadding: d < realStart,
    });
    d.setDate(d.getDate() + 1);
    dayIndex++;
  }
  return { cells, monthLabels };
}

export default function Heatmap({ start, end }: { start: string; end: string }) {
  const { progress, toggleActivity, isSignedIn } = useProgress();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cells, monthLabels } = buildCells(start, end);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [start, end]);

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-labels">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div className="heatmap-scroll" ref={scrollRef}>
        <div className="heatmap-months">
          {monthLabels.map((ml) => (
            <div key={ml.col} className="month-label" style={{ gridColumn: `${ml.col + 1} / span 4` }}>
              {MONTH_NAMES[ml.month]}
            </div>
          ))}
        </div>
        <div className="heatmap-grid">
          {cells.map((c) =>
            c.isPadding ? (
              <div key={c.iso} className="cell pad" />
            ) : (
              <div
                key={c.iso}
                className={
                  'cell' +
                  (progress.activity[c.iso] ? ' done' : '') +
                  (c.isFuture || !isSignedIn ? ' future' : '') +
                  (c.isToday ? ' today' : '')
                }
                title={!isSignedIn ? 'Sign in to save progress' : c.iso}
                onClick={() => {
                  if (!c.isFuture && isSignedIn) toggleActivity(c.iso);
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
