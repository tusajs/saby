import Slots from "./Slots";
const times = ["09:00","10:30","12:00","13:30","15:00","16:30","18:00","19:30"];
export default function DaySlots({ day, time, onSelect }) {
  const slots = times.map((value, index) => ({time: value, available: (day.getDate() + index) % 4 !== 0}));
  return <Slots slots={slots} time={time} onSelect={onSelect}/>;
}
