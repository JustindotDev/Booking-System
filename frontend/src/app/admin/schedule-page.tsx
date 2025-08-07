import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import ScheduleCalendar from "@/components/calendar";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useAdminScheduleStore } from "@/store/useAdminScheduleStore";
import { AdminDialog } from "@/components/dialog";
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

type ClosedDate = {
  date: string;
};

export default function Schedule() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [daysClosed, setDaysClosed] = useState<ClosedDate | null>({
    date: "",
  });

  const {
    dayOffSchedule,
    fetchSchedule,
    setDayOff,
    isFetching,
    setClosedDays,
  } = useAdminScheduleStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await setDayOff({ day: selectedDays });
    } catch (error) {
      console.log("Error: ", error);
    }

    fetchSchedule();
    setSelectedDays([]);
  };

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const removeDay = (dayToRemove: string) => {
    setSelectedDays((prev) => prev.filter((d) => d !== dayToRemove));
  };

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = new Date(arg.dateStr);
    const calendarApi = arg.view.calendar;
    const currentDate = calendarApi.getDate();
    const clickedMonth = clickedDate.getMonth();
    const currentMonth = currentDate.getMonth();

    const clickedYear = clickedDate.getFullYear();
    const currentYear = currentDate.getFullYear();
    if (clickedMonth !== currentMonth || clickedYear !== currentYear) {
      return;
    }
    const formattedDate = clickedDate.toISOString().split("T")[0];

    setDaysClosed({ date: formattedDate });
    setOpenDialog(true);
  };

  const submitClosedDays = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await setClosedDays(daysClosed);
    } catch (error) {
      console.log("Error: ", error);
    }
    setOpenDialog(false);
  };

  const closedEvents = dayOffSchedule.map((entry) => ({
    start: entry.date!,
    allDay: true,
    display: "background",
    color: "red",
  }));

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
                <Card>
                  <CardHeader>
                    <CardTitle>Set Day Off Schedule</CardTitle>
                    <CardDescription>
                      You can select multiple day as your day off
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isFetching ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    ) : dayOffSchedule.length > 0 ? (
                      dayOffSchedule.map((day) => (
                        <div key={day.id} className="flex flex-wrap gap-2">
                          {day.day_off?.map((dayName) => (
                            <div
                              key={dayName}
                              className="border px-4 py-1 rounded-lg"
                            >
                              {dayName}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <blockquote className="mt-6 pl-6 italic text-gray-600">
                        No scheduled day off.
                      </blockquote>
                    )}
                  </CardContent>
                  <CardFooter>
                    <form onSubmit={handleSubmit}>
                      <div className="flex flex-col gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className=" min-w-[260px] w-fit justify-start h-auto "
                            >
                              {selectedDays.length > 0
                                ? selectedDays.map((day) => (
                                    <div
                                      key={day}
                                      className="relative border px-2 py-1 rounded-lg group"
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeDay(day);
                                        }}
                                        className="absolute -right-1 -top-1 text-gray-400 bg-white rounded-full  opacity-0 group-hover:opacity-100 transition-opacity "
                                      >
                                        <CircleX size={14} />
                                      </button>
                                      {day}
                                    </div>
                                  ))
                                : "Select days"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[260px]">
                            <div className="grid gap-2">
                              {weekDays.map((day) => (
                                <div
                                  key={day}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={day}
                                    checked={selectedDays.includes(day)}
                                    onCheckedChange={() => toggleDay(day)}
                                  />
                                  <Label htmlFor={day}>{day}</Label>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Button type="submit" className="w-1/2">
                          Set Day Off
                        </Button>
                      </div>
                    </form>
                  </CardFooter>
                </Card>
              </div>

              {/* Closed Schedule */}
              <div className="px-4 lg:px-6 flex-grow ">
                <h2 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
                  Closed Days
                </h2>
                <Card className="min-w-md">
                  <CardContent>
                    <ScheduleCalendar
                      initialView="dayGridMonth"
                      weekday="short"
                      handleDateClick={handleDateClick}
                      events={closedEvents}
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
        title="Mark as closed?"
        description="This will mark the selected date as unavailable for scheduling."
        onSubmit={submitClosedDays}
      ></AdminDialog>
    </SidebarProvider>
  );
}
