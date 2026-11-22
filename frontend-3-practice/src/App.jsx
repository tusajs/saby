import { useState } from "react";
import Booking from "./Booking";
export default function App() {
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  return <Booking today={today}/>;
}
