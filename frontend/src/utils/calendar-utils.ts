import type { DateClickArg } from "@fullcalendar/interaction";
import type { ScheduleEntry } from "@/store/useAdminScheduleStore";

type DayOffScheduleEntry = {
  day_off: string[] | null;
  date: string | null;
};

const getDayOffNumbers = (
  dayOffSchedule: DayOffScheduleEntry[],
  weekDays: string[]
) => {
  return dayOffSchedule.flatMap((entry) =>
    (entry.day_off || []).map((day) => weekDays.indexOf(day))
  );
};

const getDayOffWeekdays = (
  dayOffSchedule: DayOffScheduleEntry[],
  weekDays: string[]
) => {
  return dayOffSchedule.flatMap((entry) =>
    (entry.day_off || []).map((weekday) => ({
      daysOfWeek: [weekDays.indexOf(weekday)],
      display: "background",
      color: "#d3d3d3",
    }))
  );
};

const getClosedEvents = (dayOffSchedule: DayOffScheduleEntry[]) => {
  return dayOffSchedule.map((entry) => ({
    start: entry.date!,
    allDay: true,
    display: "background",
    color: "red",
  }));
};

const getAllEvents = (
  dayOffSchedule: DayOffScheduleEntry[],
  weekDays: string[]
) => {
  const closedEvents = getClosedEvents(dayOffSchedule);
  const dayOffWeekdays = getDayOffWeekdays(dayOffSchedule, weekDays);
  return [...closedEvents, ...dayOffWeekdays];
};

const processDateClick = (
  arg: DateClickArg,
  dayOffNumbers: number[],
  dayOffSchedule: ScheduleEntry[]
) => {
  const clickedDate = new Date(arg.dateStr);

  // Don't allow clicks on day-off days
  if (dayOffNumbers.includes(clickedDate.getDay())) return null;

  const calendarApi = arg.view.calendar;
  const currentDate = calendarApi.getDate();

  const clickedMonth = clickedDate.getMonth();
  const currentMonth = currentDate.getMonth();
  const clickedYear = clickedDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  if (clickedMonth !== currentMonth || clickedYear !== currentYear) return null;

  const formattedDate = clickedDate.toISOString().split("T")[0];
  const matchedDay = dayOffSchedule.find((day) => day.date === formattedDate);

  return { date: formattedDate, id: matchedDay?.id };
};

export {
  getDayOffNumbers,
  getDayOffWeekdays,
  getClosedEvents,
  getAllEvents,
  processDateClick,
};
