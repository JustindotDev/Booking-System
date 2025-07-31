import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type Treatment = {
  id: string;
  name: string;
  price: number;
};

type TreatmentsInfo = {
  name?: string;
  price?: number;
};

type AdminServiceStore = {
  treatments: Treatment[];
  isFetching: boolean;
  fetchTreatments: () => Promise<void>;
  createTreatments: (data: TreatmentsInfo) => Promise<boolean>;
  updateTreatments: (id: string, data: TreatmentsInfo) => Promise<void>;
  deleteTreatments: (id: string) => Promise<void>;
};

export const useAdminServiceStore = create<AdminServiceStore>((set) => ({
  treatments: [],
  isFetching: false,

  fetchTreatments: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/treatments/get-treatments");
      set({ treatments: res.data.treatments });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isFetching: false });
    }
  },

  createTreatments: async (data: TreatmentsInfo) => {
    try {
      const res = await axiosInstance.post(
        "/treatments/create-treatments",
        data
      );
      toast.success(res.data.message);
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
      return false;
    }
  },

  updateTreatments: async (id: string | null, data: TreatmentsInfo) => {
    try {
      const res = await axiosInstance.put(`/treatments/${id}`, data);
      toast.success(res.data.message);
      const updated = res.data.treatment;

      set((state) => ({
        treatments: state.treatments.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },

  deleteTreatments: async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/treatments/${id}`);
      toast.success(res.data.message);
      set((state) => ({
        treatments: state.treatments.filter((t) => t.id !== id),
      }));
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
}));
