import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Calendar from "@/components/calendar";
import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";
import { useEffect } from "react";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";

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
              <div className="px-4 lg:px-6">
                <Calendar
                  initialView="dayGridMonth"
                  weekday="short"
                  events={allEvents}
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
      </SidebarInset>
    </SidebarProvider>
  );
}
