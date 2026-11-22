export default function Slots({ slots, time, onSelect }) {
  return <><div id="slots">{slots.map(slot => <button key={slot.time} disabled={!slot.available}
    aria-pressed={time === slot.time} onClick={() => onSelect(slot.time)}>{slot.time}</button>)}</div>
    <p className="hint">Занятое время зачёркнуто.</p></>;
}
