'use client';

import LessonCard, { Lesson } from '@/components/LessonCard';
import lessonsData from '@/data/lessons.json';

const lessons = lessonsData as Lesson[];

function fmtDate(iso: string) {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
}

export default function PlanPage() {
  const weeks = new Map<string, Lesson[]>();
  lessons.forEach((l) => {
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

      {Array.from(weeks.entries()).map(([weekName, items]) => (
        <div className="week" key={weekName}>
          <div className="dates">
            {fmtDate(items[0].date)} – {fmtDate(items[items.length - 1].date)}
          </div>
          <h4>{weekName}</h4>
          {items.map((l) => (
            <LessonCard lesson={l} key={l.day} />
          ))}
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
