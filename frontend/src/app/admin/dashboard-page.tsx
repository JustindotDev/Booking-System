import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Calendar from "@/components/calendar";
import { DashboardSheet } from "@/components/dashboard-sheet";
import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";
import { useEffect, useState } from "react";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import type { DateClickArg } from "@fullcalendar/interaction";

const weekDays: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Dashboard() {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const { dayOffSchedule, fetchSchedule } = useAdminScheduleStore();
  const { appointments, fetchAppointments } = useAdminDashboardStore();

  useEffect(() => {
    fetchSchedule();
    fetchAppointments();
  }, [fetchSchedule, fetchAppointments]);

  const daysWithAppointment = appointments.map((entry) => ({
    title: entry.customer_name,
    start: entry.appointment_date,
    allDay: true,
    color: "#4A90E2",
  }));

  const dayOffNumbers = dayOffSchedule.flatMap((entry) =>
    (entry.day_off || []).map((day) => weekDays.indexOf(day))
  );

  const dayOffWeekdays = dayOffSchedule.flatMap((entry) =>
    (entry.day_off || []).map((weekday) => ({
      daysOfWeek: [weekDays.indexOf(weekday)],
      display: "background",
      color: "#d3d3d3",
    }))
  );

  const closedEvents = dayOffSchedule.map((entry) => ({
    start: entry.date!,
    allDay: true,
    display: "background",
    color: "red",
  }));

  const allEvents = [
    ...closedEvents,
    ...dayOffWeekdays,
    ...daysWithAppointment,
  ];

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = new Date(arg.dateStr);

    // Block if it's a recurring day-off
    if (dayOffNumbers.includes(clickedDate.getDay())) {
      return;
    }

    // Block if it's a closed date
    const isClosedDate = closedEvents.some(
      (event) =>
        event.start &&
        new Date(event.start).toDateString() === clickedDate.toDateString()
    );
    if (isClosedDate) {
      return;
    }
    const calendarApi = arg.view.calendar;
    const currentDate = calendarApi.getDate();
    const clickedMonth = clickedDate.getMonth();
    const currentMonth = currentDate.getMonth();

    const clickedYear = clickedDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    if (clickedMonth !== currentMonth || clickedYear !== currentYear) {
      return;
    }

    const haveAppointment = daysWithAppointment.some(
      (event) =>
        event.start &&
        new Date(event.start).toDateString() === clickedDate.toDateString()
    );

    const parts = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(clickedDate);

    const customDate = `${parts.find((p) => p.type === "weekday")?.value} • ${
      parts.find((p) => p.type === "month")?.value
    } ${parts.find((p) => p.type === "day")?.value} - ${
      parts.find((p) => p.type === "year")?.value
    }`;

    if (haveAppointment) {
      setOpenSheet(true);
      setDate(customDate);
    }
  };
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex justify-center">
                <div className="w-11/12  items-center ">
                  <div
                    className="   
                  flex flex-col items-start gap-3 w-fit
                  bg-white/80 px-3 py-2 rounded-lg shadow-sm
                  md:flex-row md:gap-6"
                  >
                    {/* Day-Off */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-400"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Day-Off
                      </span>
                    </div>

                    {/* Closed Days */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-300"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Closed Days
                      </span>
                    </div>

                    {/* Events */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-400"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Events
                      </span>
                    </div>
                  </div>

                  <Calendar
                    initialView="dayGridMonth"
                    weekday="short"
                    events={allEvents}
                    aspectRatio={1.8}
                    handleDateClick={handleDateClick}
                    dayCellClassNames={(arg) => {
                      const dow = arg.date.getDay();
                      // Recurring day-offs (weekly)
                      const isDayOff = dayOffNumbers.includes(dow);

                      // Specific closed dates
                      const isClosedDate = closedEvents.some(
                        (event) =>
                          event.start &&
                          new Date(event.start).toDateString() ===
                            arg.date.toDateString()
                      );

                      // Apply classes accordingly
                      const classes = [];
                      if (isDayOff) classes.push("fc-day-off");
                      if (isClosedDate) classes.push("fc-closed-day");

                      return classes;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      <DashboardSheet
        open={openSheet}
        openOnChange={setOpenSheet}
        date={date}
      />
    </SidebarProvider>
  );
}
