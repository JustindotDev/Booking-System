import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type CreateTreatments = {
  name: string;
  price: number;
};

type AdminServiceStore = {
  treatments: [];
  isFetching: boolean;
  fetchTreatments: () => Promise<void>;
  createTreatments: (data: CreateTreatments) => Promise<boolean>;
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

  createTreatments: async (data: CreateTreatments) => {
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

  deleteTreatments: async (id: string) => {
    try {
      const res = await axiosInstance.post(`/treatments/${id}`);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
}));
