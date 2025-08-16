import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export type Appointments = {
  id: string;
  customer_name: string;
  contact_info: string;
  treatment: string;
  appointment_date: string;
  status: string;
};
type AdminDashboardStore = {
  appointments: Appointments[];
  fetchAppointments: () => Promise<void>;
  confirmAppointments: (id: string) => Promise<void>;
  cancelAppointments: (id: string) => Promise<void>;
};

export const useAdminDashboardStore = create<AdminDashboardStore>((set) => ({
  appointments: [],

  fetchAppointments: async () => {
    try {
      const res = await axiosInstance.get("/appointments/get-appointments");
      set({ appointments: res.data.appointments });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },

  confirmAppointments: async (id) => {
    try {
      const res = await axiosInstance.put(`/appointments/confirm/${id}`);
      toast.success(res.data.message, { position: "bottom-right" });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
  cancelAppointments: async (id) => {
    try {
      const res = await axiosInstance.put(`/appointments/cancel/${id}`);
      toast.success(res.data.message, { position: "bottom-right" });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
}));
