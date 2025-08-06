import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Calendar({
  initialView,
  weekday,
  buttonText = {
    today: "Today",
  },
}: {
  initialView: string;
  weekday: "long" | "short" | "narrow";
  showHeader?: boolean;
  buttonText?: {
    today?: string;
  };
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView={initialView}
      dayHeaderFormat={{ weekday: weekday }}
      aspectRatio={1.35}
      buttonText={buttonText}
    />
  );
}
