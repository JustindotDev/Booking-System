import React, { useEffect, useState } from "react";

import type { DateClickArg } from "@fullcalendar/interaction";

import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import ScheduleCalendar from "@/components/calendar";
import { AdminDialog } from "@/components/dialog";
import { getWeekDays } from "@/lib/weekdays";
import DayOffCard from "@/components/schedule/dayoff-card";
import {
  getDayOffNumbers,
  getAllEvents,
  processDateClick,
  getClosedEvents,
} from "@/utils/calendar-utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";

type ClosedDate = {
  id?: string;
  date: string;
};

export default function Schedule() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [daysClosed, setDaysClosed] = useState<ClosedDate | null>({
    date: "",
  });

  const { dayOffSchedule, fetchSchedule, setClosedDays, deleteClosedDays } =
    useAdminScheduleStore();

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const weekDays = getWeekDays;
  const dayOffNumbers = getDayOffNumbers(dayOffSchedule, weekDays);
  const closedEvents = getClosedEvents(dayOffSchedule);
  const allEvents = getAllEvents(dayOffSchedule, weekDays);

  const handleDateClick = (arg: DateClickArg) => {
    const result = processDateClick(
      arg,
      dayOffNumbers,
      closedEvents,
      dayOffSchedule,
      {
        blockClosedDates: false,
      }
    );
    if (!result) return;
    setDaysClosed(result);
    setOpenDialog(true);
  };

  const submitClosedDays = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await setClosedDays(daysClosed);
      fetchSchedule();
    } catch (error) {
      console.log("Error: ", error);
    }
    setOpenDialog(false);
  };

  const handleUnmarkClosedDays = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!daysClosed?.id) {
      console.error("No ID available to delete");
      return;
    }
    try {
      await deleteClosedDays(daysClosed.id);
      fetchSchedule();
    } catch (error) {
      console.log("Error: ", error);
    }
    setOpenDialog(false);
  };

  const isClosed = dayOffSchedule.some((day) => day.date === daysClosed?.date);

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
        <SiteHeader title=" Your Schedule" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col lg:flex-row gap-4 py-4 md:gap-6 md:py-6 ">
              {/* Day Off Schedule */}
              <div className="px-4 lg:px-6 flex-grow ">
                <h2 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4 ">
                  Day Off Schedule
                </h2>
                <DayOffCard />
              </div>

              {/* Closed Schedule */}
              <div className="px-4 lg:px-6 flex-grow ">
                <div className="flex items-center justify-between">
                  <h2 className="scroll-m-20 text-xl font-semibold tracking-tight mb-2">
                    Closed Days
                  </h2>
                  <div className="flex items-center gap-6 mb-2">
                    {/* Day-Off */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gray-400 shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Day-Off
                      </span>
                    </div>

                    {/* Closed Days */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-300 shadow-sm"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Closed Days
                      </span>
                    </div>
                  </div>
                </div>
                <Card className="min-w-md">
                  <CardContent>
                    <ScheduleCalendar
                      initialView="dayGridMonth"
                      headerToolbar={{ center: "" }}
                      weekday="short"
                      handleDateClick={handleDateClick}
                      events={allEvents}
                      aspectRatio={1.35}
                      dayCellClassNames={(arg) => {
                        const dow = arg.date.getDay(); // 0 = Sunday, 1 = Monday...
                        return dayOffNumbers.includes(dow)
                          ? ["fc-day-off"]
                          : [];
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <AdminDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={isClosed ? "Remove Closed Status?" : "Mark as closed?"}
        description={
          isClosed
            ? "This will mark the selected date as available for scheduling."
            : "This will mark the selected date as unavailable for scheduling."
        }
        onSubmit={isClosed ? handleUnmarkClosedDays : submitClosedDays}
      ></AdminDialog>
    </SidebarProvider>
  );
}
