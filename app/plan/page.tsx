'use client';

import { useProgress } from '@/lib/progress-context';
import lessons from '@/data/lessons.json';

type Lesson = {
  day: number;
  date: string;
  weekday: string;
  week: string;
  grammar: string;
  domain: string;
  scenario: string;
};

function fmtDate(iso: string) {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

export default function PlanPage() {
  const { progress, toggleLesson, isSignedIn } = useProgress();

  const weeks = new Map<string, Lesson[]>();
  (lessons as Lesson[]).forEach((l) => {
    if (!weeks.has(l.week)) weeks.set(l.week, []);
    weeks.get(l.week)!.push(l);
  });

  return (
    <section>
      <h2>Plan · 46 lessons, Mon–Fri, 2h</h2>
      <p className="sub">28 Сен – 30 Ноя · декабрь — полировка перед B2-экзаменом</p>

      <div className="day-structure">
        <div>
          <b>30 мин</b>Grammar — тема недели
        </div>
        <div>
          <b>20 мин</b>Vocabulary — слова из Notion с низким Score
        </div>
        <div>
          <b>50 мин</b>Speaking simulation — тема дня
        </div>
        <div>
          <b>20 мин</b>Feedback + error log
        </div>
      </div>

      {!isSignedIn && (
        <div className="signin-banner">
          <b>Sign in to save progress</b>
          <span>Checkboxes are disabled while you&apos;re signed out.</span>
        </div>
      )}

      {Array.from(weeks.entries()).map(([weekName, items]) => (
        <div className="week" key={weekName}>
          <div className="dates">
            {fmtDate(items[0].date)} – {fmtDate(items[items.length - 1].date)}
          </div>
          <h4>{weekName}</h4>
          {items.map((l) => {
            const done = !!progress.lessons[String(l.day)];
            return (
              <label className={'lesson-row' + (done ? ' done' : '')} key={l.day}>
                <input
                  type="checkbox"
                  checked={done}
                  disabled={!isSignedIn}
                  onChange={() => toggleLesson(l.day)}
                />
                <span className="lesson-day">Day {l.day}</span>
                <span className="lesson-date">
                  {fmtDate(l.date)} · {l.weekday}
                </span>
                <span className="lesson-grammar">{l.grammar}</span>
                <span className="lesson-domain">
                  {l.domain} — {l.scenario}
                </span>
              </label>
            );
          })}
        </div>
      ))}

      <div className="dec">
        <h3>Декабрь — полировка перед B2</h3>
        <ul>
          <li>1–3 дек: полный mock-тест (speaking + writing + listening) → находим реальные провалы</li>
          <li>Ежедневно: 1 grammar drill по error log + 1 таймированное задание в формате экзамена</li>
          <li>
            Приоритет по диагностике: articles, 3rd person -s, past tense, word order, infinitive/gerund,
            prepositions, conditionals
          </li>
          <li>Отдельно закрыть непроверенное: listening на естественной скорости, writing</li>
          <li>Последние 2 недели: один полный практический тест в неделю + разбор ошибок</li>
        </ul>
      </div>
    </section>
  );
}
