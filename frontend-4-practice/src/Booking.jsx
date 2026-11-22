import { useRef, useState } from "react";
import Calendar from "./Calendar";
import DaySlots from "./DaySlots";

export default function Booking({ today }) {
  const [day, setDay] = useState(today);
  const [time, setTime] = useState(null);
  const review = useRef(null);
  const dateLabel = day.toLocaleDateString("ru-RU", { dateStyle: "full" });
  const summary = time ? dateLabel + " • " + time : dateLabel;
  function selectDay(date) {
    if (+date !== +day) {
      setDay(date);
      setTime(null);
    }
  }
  return <><header className="masthead"><strong>ÉLAIRE</strong><span>Онлайн-запись</span></header>
    <main><p className="step">Запись в салон · Шаг 2 из 3</p><h1>Выбор даты и времени</h1>
      <div className="schedule"><Calendar today={today} day={day} onSelect={selectDay}/>
        <section className="times"><h2>Время визита</h2><p id="slot-date">{dateLabel}</p>
          <DaySlots key={day.getTime()} day={day} time={time} onSelect={setTime}/>
        </section></div>
      <footer><div><small>Ваш выбор</small><output aria-live="polite">{summary}</output></div>
        <button id="continue" disabled={!time} onClick={() => review.current.showModal()}>Далее →</button></footer>
    </main>
    <dialog ref={review}><h2>Детали визита</h2><p>{summary}</p><form method="dialog"><button>Вернуться к выбору</button></form></dialog>
  </>;
}
