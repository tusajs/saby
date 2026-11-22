from dataclasses import dataclass
from datetime import time as ClockTime
import re


@dataclass(frozen=True)
class Appoinment:
    id: int
    client_name: str
    master_id: int
    service_id: int
    time: str


masters = {1: "Анна", 2: "Борис"}
services = {1: "Стрижка", 2: "Укладка"}
appointments: list[Appoinment] = []


def create_appointment(client_name: str, master_id: int, service_id: int,
                       time: str) -> Appoinment | None:
    if not isinstance(client_name, str) or not client_name.strip():
        return None
    if master_id not in masters or service_id not in services:
        return None
    if not isinstance(time, str) or not re.fullmatch(r"[0-9]{2}:[0-9]{2}", time):
        return None
    try:
        start = ClockTime.fromisoformat(time)
    except ValueError:
        return None
    if not ClockTime(8) <= start < ClockTime(20):
        return None
    if any(record.master_id == master_id and record.time == time for record in appointments):
        return None
    record = Appoinment(len(appointments) + 1, client_name.strip(), master_id, service_id, time)
    appointments.append(record)
    return record


if __name__ == "__main__":
    create_appointment("Иванова А.А.", 1, 1, "10:00")
    create_appointment("Петрова А.А.", 1, 1, "11:00")
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)
    assert create_appointment("", 1, 1, "12:00") is None
    assert create_appointment("Сидорова А.А.", 1, 1, "00:00") is None
    assert len(appointments) == 2
