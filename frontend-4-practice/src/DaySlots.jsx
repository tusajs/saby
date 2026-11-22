import { useEffect, useState } from "react";
import { fetchSlots } from "./api";
import Slots from "./Slots";
export default function DaySlots({ day, time, onSelect }) {
  const [slots, setSlots] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetchSlots({year: day.getFullYear(), month: day.getMonth(), day: day.getDate()})
      .then(result => { if (active) setSlots(result.slots); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [day]);
  if (failed) return <p role="alert">Не удалось загрузить время. Выберите другой день или обновите страницу.</p>;
  if (!slots) return <p role="status">Загрузка времени…</p>;
  return <Slots slots={slots} time={time} onSelect={onSelect}/>;
}
