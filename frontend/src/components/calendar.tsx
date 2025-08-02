import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar({
  initialView,
  weekday,
}: {
  initialView: string;
  weekday: "long" | "short" | "narrow";
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView={initialView}
      dayHeaderFormat={{ weekday: weekday }}
      height="auto"
    />
  );
}
