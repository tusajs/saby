import { useState } from "react";

const weekdays = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
const monthFormat = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
export default function Calendar({ today, day, onSelect }) {
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = month.getFullYear();
  const number = month.getMonth();
  const offset = (month.getDay() + 6) % 7;
  const count = new Date(year, number + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((count + offset) / 7) * 7 },
    (_, index) => new Date(year, number, index - offset + 1));
  const move = delta => setMonth(new Date(year, number + delta, 1));
  return <section aria-label="Календарь">
    <div className="month-nav"><h2 id="month">{monthFormat.format(month)}</h2><div>
      <button aria-label="Предыдущий месяц" onClick={() => move(-1)}>‹</button>
      <button aria-label="Следующий месяц" onClick={() => move(1)}>›</button>
    </div></div>
    <div className="week" aria-hidden="true">{weekdays.map(label => <span key={label}>{label}</span>)}</div>
    <div id="days">{cells.map(date => <button key={date.getTime()}
      aria-label={date.toLocaleDateString("ru-RU", {dateStyle:"full"})}
      aria-pressed={+day === +date} disabled={date < today || date.getMonth() !== number}
      onClick={() => onSelect(date)}>{date.getDate()}</button>)}</div>
  </section>;
}
