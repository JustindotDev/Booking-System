import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventInput, DayCellContentArg } from "@fullcalendar/core";

export default function ScheduleCalendar({
  initialView,
  weekday,
  headerToolbar = {
    left: "",
    center: "title",
  },
  buttonText = {
    today: "Today",
  },
  handleDateClick,
  events = [],
  dayCellClassNames,
  aspectRatio,
}: {
  initialView: string;
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
  weekday: "long" | "short" | "narrow";
  buttonText?: {
    today?: string;
  };
  handleDateClick?: (arg: DateClickArg) => void;
  events?: EventInput[];
  dayCellClassNames?: (arg: DayCellContentArg) => string[];
  aspectRatio: number;
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView={initialView}
      dayHeaderFormat={{ weekday: weekday }}
      headerToolbar={headerToolbar}
      aspectRatio={aspectRatio}
      buttonText={buttonText}
      dateClick={handleDateClick}
      events={events}
      dayCellClassNames={dayCellClassNames}
      dayMaxEventRows={true}
      views={{
        dayGridMonth: {
          dayMaxEventRows: 2,
        },
      }}
    />
  );
}
