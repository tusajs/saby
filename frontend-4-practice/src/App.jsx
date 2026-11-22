import { useEffect, useState } from "react";
import { fetchToday } from "./api";
import Booking from "./Booking";
export default function App() {
  const [today, setToday] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetchToday().then(({ year, month, day }) => {
      if (active) setToday(new Date(year, month, day));
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);
  if (failed) return <main role="alert">Не удалось загрузить дату. Обновите страницу.</main>;
  if (!today) return <main role="status">Загрузка календаря…</main>;
  return <Booking today={today}/>;
}
