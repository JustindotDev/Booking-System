import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventInput, DayCellContentArg } from "@fullcalendar/core";

export default function ScheduleCalendar({
  initialView,
  weekday,
  buttonText = {
    today: "Today",
  },
  handleDateClick,
  events = [],
  dayCellClassNames,
}: {
  initialView: string;
  weekday: "long" | "short" | "narrow";
  showHeader?: boolean;
  buttonText?: {
    today?: string;
  };
  handleDateClick?: (arg: DateClickArg) => void;
  events?: EventInput[];
  dayCellClassNames?: (arg: DayCellContentArg) => string[];
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView={initialView}
      dayHeaderFormat={{ weekday: weekday }}
      aspectRatio={1.35}
      buttonText={buttonText}
      dateClick={handleDateClick}
      events={events}
      dayCellClassNames={dayCellClassNames}
    />
  );
}
