import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type Appointments = {
  id: string;
  customer_name: string;
  contact_info: string;
  treatment_id: string;
  appointment_date: string;
  status: string;
};
type AdminDashboardStore = {
  appointments: Appointments[];
  fetchAppointments: () => Promise<void>;
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
}));
