import type { DateClickArg } from "@fullcalendar/interaction";
import type { ScheduleEntry } from "@/store/useAdminScheduleStore";
import type { Appointments } from "@/store/useAdminDashboardStore";

type DayOffScheduleEntry = {
  day_off: string[] | null;
  date: string | null;
};

type AppointmentsEntry = Partial<Appointments>;

type ProcessDateClickOptions = {
  blockDayOffs?: boolean;
  blockClosedDates?: boolean;
  blockOutsideMonth?: boolean;
  returnCustomDate?: boolean;
  daysWithAppointment?: { start: string }[];
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
  weekDays: string[],
  appointments?: AppointmentsEntry[]
) => {
  const closedEvents = getClosedEvents(dayOffSchedule);
  const dayOffWeekdays = getDayOffWeekdays(dayOffSchedule, weekDays);
  const appointmentEvents = appointments
    ? getDaysWithAppointment(appointments)
    : [];

  return [...closedEvents, ...dayOffWeekdays, ...appointmentEvents];
};

const getDaysWithAppointment = (appointments: AppointmentsEntry[]) => {
  return appointments.map((entry) => ({
    title: entry.customer_name,
    start: entry.appointment_date,
    allDay: true,
    color: "#4A90E2",
  }));
};

const processDateClick = (
  arg: DateClickArg,
  dayOffNumbers: number[],
  closedEvents: { start: string }[],
  dayOffSchedule: ScheduleEntry[],
  options: ProcessDateClickOptions = {}
) => {
  const {
    blockDayOffs = true,
    blockClosedDates = true,
    blockOutsideMonth = true,
    returnCustomDate = false,
    daysWithAppointment = [],
  } = options;
  const clickedDate = new Date(arg.dateStr);

  // Don't allow clicks on day-off days
  if (blockDayOffs && dayOffNumbers.includes(clickedDate.getDay())) return null;

  // Don't allow clicks on closed days
  if (
    blockClosedDates &&
    closedEvents.some(
      (event) =>
        event.start &&
        new Date(event.start).toDateString() === clickedDate.toDateString()
    )
  ) {
    return null;
  }

  const calendarApi = arg.view.calendar;
  const currentDate = calendarApi.getDate();

  const clickedMonth = clickedDate.getMonth();
  const currentMonth = currentDate.getMonth();
  const clickedYear = clickedDate.getFullYear();
  const currentYear = currentDate.getFullYear();

  if (
    (blockOutsideMonth && clickedMonth !== currentMonth) ||
    clickedYear !== currentYear
  )
    return null;

  const haveAppointments = daysWithAppointment.some(
    (event) =>
      event.start &&
      new Date(event.start).toDateString() === clickedDate.toDateString()
  );

  const formattedDate = clickedDate.toISOString().split("T")[0];
  const matchedDay = dayOffSchedule.find((day) => day.date === formattedDate);

  let customDate: string | undefined;
  if (returnCustomDate) {
    const parts = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(clickedDate);

    customDate = `${parts.find((p) => p.type === "weekday")?.value} • ${
      parts.find((p) => p.type === "month")?.value
    } ${parts.find((p) => p.type === "day")?.value} - ${
      parts.find((p) => p.type === "year")?.value
    }`;
  }

  return {
    date: formattedDate,
    id: matchedDay?.id,
    customDate,
    haveAppointments,
  };
};

export {
  getDayOffNumbers,
  getDayOffWeekdays,
  getClosedEvents,
  getAllEvents,
  processDateClick,
  getDaysWithAppointment,
};
