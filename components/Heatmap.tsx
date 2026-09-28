'use client';

import { useEffect, useRef } from 'react';
import { useProgress } from '@/lib/progress-context';

const HEATMAP_START = '2026-09-28'; // Monday
const HEATMAP_END = '2026-12-31';
const MONTH_NAMES = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

type Cell = { iso: string; isFuture: boolean; isToday: boolean };
type MonthLabel = { month: number; col: number };

function buildCells() {
  const start = new Date(HEATMAP_START + 'T00:00:00');
  const end = new Date(HEATMAP_END + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  const cells: Cell[] = [];
  const monthLabels: MonthLabel[] = [];
  let d = new Date(start);
  let dayIndex = 0;
  let lastMonth = -1;

  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    const dow = (d.getDay() + 6) % 7; // Mon=0..Sun=6
    const col = Math.floor(dayIndex / 7);
    if (dow === 0) {
      const m = d.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        monthLabels.push({ month: m, col });
      }
    }
    cells.push({ iso, isFuture: d > today, isToday: iso === todayIso });
    d.setDate(d.getDate() + 1);
    dayIndex++;
  }
  return { cells, monthLabels };
}

export default function Heatmap() {
  const { progress, toggleActivity } = useProgress();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { cells, monthLabels } = buildCells();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, []);

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
          {cells.map((c) => (
            <div
              key={c.iso}
              className={
                'cell' +
                (progress.activity[c.iso] ? ' done' : '') +
                (c.isFuture ? ' future' : '') +
                (c.isToday ? ' today' : '')
              }
              title={c.iso}
              onClick={() => {
                if (!c.isFuture) toggleActivity(c.iso);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
