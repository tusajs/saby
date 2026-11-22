const times = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];
const today = new Date();
today.setHours(0, 0, 0, 0);
let month = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDay = today;
let selectedTime = null;

const byId = id => document.getElementById(id);
const fullDate = new Intl.DateTimeFormat("ru-RU", { dateStyle: "full" });
const monthName = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });

function updateSummary() {
  byId("summary").textContent = fullDate.format(selectedDay) + (selectedTime ? " • " + selectedTime : "");
  byId("continue").disabled = selectedTime === null;
}

function renderSlots() {
  byId("slot-date").textContent = fullDate.format(selectedDay);
  byId("slots").replaceChildren();
  times.forEach((time, index) => {
    const button = document.createElement("button");
    button.textContent = time;
    button.disabled = (index + selectedDay.getDate()) % 4 === 0;
    button.setAttribute("aria-pressed", String(time === selectedTime));
    button.onclick = () => {
      selectedTime = time;
      for (const other of byId("slots").children) {
        other.setAttribute("aria-pressed", String(other === button));
      }
      updateSummary();
    };
    byId("slots").append(button);
  });
}

function renderCalendar() {
  const year = month.getFullYear();
  const number = month.getMonth();
  const offset = (month.getDay() + 6) % 7;
  const total = new Date(year, number + 1, 0).getDate();
  byId("month").textContent = monthName.format(month);
  byId("days").replaceChildren();
  for (let cell = 0; cell < Math.ceil((offset + total) / 7) * 7; cell++) {
    const date = new Date(year, number, cell - offset + 1);
    const button = document.createElement("button");
    button.textContent = date.getDate();
    button.disabled = date < today || date.getMonth() !== number;
    button.setAttribute("aria-label", fullDate.format(date));
    button.setAttribute("aria-pressed", String(+date === +selectedDay));
    button.onclick = () => {
      if (+date === +selectedDay) return;
      selectedDay = date;
      selectedTime = null;
      for (const other of byId("days").children) {
        other.setAttribute("aria-pressed", String(other === button));
      }
      renderSlots();
      updateSummary();
    };
    byId("days").append(button);
  }
}

function changeMonth(delta) {
  month = new Date(month.getFullYear(), month.getMonth() + delta, 1);
  renderCalendar();
}

byId("previous").onclick = () => changeMonth(-1);
byId("next").onclick = () => changeMonth(1);
byId("continue").onclick = () => {
  byId("review-date").textContent = byId("summary").textContent;
  byId("review").showModal();
};
renderCalendar();
renderSlots();
updateSummary();
