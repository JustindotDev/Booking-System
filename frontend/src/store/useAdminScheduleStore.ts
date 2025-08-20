import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export type ScheduleEntry = {
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
  isFetching: boolean;
  isLoading: boolean;
  fetchSchedule: () => Promise<void>;
  setDayOff: (data: Schedule) => Promise<void>;
  setClosedDays: (data: { date: string } | null) => Promise<void>;
  deleteClosedDays: (id: string) => Promise<void>;
};

export const useAdminScheduleStore = create<AdminScheduleStore>((set) => ({
  dayOffSchedule: [],
  isFetching: false,
  isLoading: false,

  // REFACTOR: Create a separate separate fetch for day off and closed days
  fetchSchedule: async () => {
    set({ isFetching: true });
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
    } finally {
      set({ isFetching: false });
    }
  },

  setDayOff: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/schedule/day-off-schedule", data);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setClosedDays: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/schedule/closed-schedule", data);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteClosedDays: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(`/schedule/${id}`);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
