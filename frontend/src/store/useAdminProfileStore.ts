import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type ContactsType = {
  facebook: string;
  phone_number: string;
};

type AddressType = {
  province: string;
  city: string;
  barangay: string;
};

type ContactsInfoType = {
  id: string;
  facebook: string;
  phone_number: string;
  address: string;
};

type AdminProfileStore = {
  contactsInfo: ContactsInfoType | null;
  isLoading: boolean;
  fetchContacts: () => Promise<void>;
  updateContacts: (
    id: string | undefined,
    data: ContactsType
  ) => Promise<boolean>;
  updateAddress: (id: string, data: AddressType) => Promise<void>;
};

export const useAdminProfileStore = create<AdminProfileStore>((set) => ({
  contactsInfo: null,
  isLoading: false,

  fetchContacts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/contacts-info/");
      console.log(res.data.contacts_info);
      set({ contactsInfo: res.data.contacts_info });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateContacts: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(
        `/contacts-info/contacts/${id}`,
        data
      );
      set({ contactsInfo: res.data.data });
      toast.success(res.data.message);
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateAddress: async (id, data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put(`/contacts-info/address/${id}`, data);
      set({ contactsInfo: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
