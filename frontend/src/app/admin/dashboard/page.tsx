import { useEffect, useState } from "react";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";

import type { DateClickArg } from "@fullcalendar/interaction";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardSheet } from "@/components/dashboard/sheet";
import { getWeekDays } from "@/lib/weekdays";
import Calendar from "@/components/calendar";
import {
  getDaysWithAppointment,
  getDayOffNumbers,
  getClosedEvents,
  getAllEvents,
  processDateClick,
} from "@/utils/calendar-utils";

export default function Dashboard() {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [date, setDate] = useState<string | undefined>("");
  const { dayOffSchedule, fetchSchedule } = useAdminScheduleStore();
  const { appointments, fetchAppointments } = useAdminDashboardStore();

  useEffect(() => {
    fetchSchedule();
    fetchAppointments();
  }, [fetchSchedule, fetchAppointments]);

  const weekDays = getWeekDays;
  const daysWithAppointment = getDaysWithAppointment(appointments);
  const dayOffNumbers = getDayOffNumbers(dayOffSchedule, weekDays);
  const closedEvents = getClosedEvents(dayOffSchedule);
  const allEvents = getAllEvents(dayOffSchedule, weekDays, appointments);

  const handleDateClick = (arg: DateClickArg) => {
    const result = processDateClick(
      arg,
      dayOffNumbers,
      closedEvents,
      dayOffSchedule,
      {
        daysWithAppointment: daysWithAppointment
          .filter((e) => e.start)
          .map((e) => ({ start: e.start! })),
      }
    );

    if (result?.haveAppointments) {
      setOpenSheet(true);
      setDate(result.customDate);
    }
  };
  return (
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
      <DashboardSheet
        open={openSheet}
        openOnChange={setOpenSheet}
        date={date}
      />
    </SidebarInset>
  );
}
