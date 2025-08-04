import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type ScheduleEntry = {
  id: string;
  isClosed: boolean;
  date: string | null;
  day_off: string[] | null;
};

type Schedule = {
  day: string[];
};

type AdminScheduleStore = {
  dayOffSchedule: ScheduleEntry[];
  setDayOff: (data: Schedule) => Promise<void>;
  fetchSchedule: () => Promise<void>;
};

export const useAdminScheduleStore = create<AdminScheduleStore>((set) => ({
  dayOffSchedule: [],

  fetchSchedule: async () => {
    try {
      const res = await axiosInstance.get("/schedule/get-schedule");
      set({
        dayOffSchedule: res.data.schedule.filter(
          (entry: ScheduleEntry) => !entry.isClosed
        ),
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },

  setDayOff: async (data) => {
    try {
      const res = await axiosInstance.post("/schedule/day-off-schedule", data);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
}));
