import { type NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type Signup = Login & {
  username: string;
};

type Login = {
  email: string;
  password: string;
};

type User = {
  id: string;
  username?: string;
  email: string;
};

type AuthStore = {
  authUser: User | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  passwordError: string;
  clearPasswordError: () => void;
  checkAuth: () => Promise<void>;
  signUp: (data: Signup, navigate: NavigateFunction) => Promise<void>;
  login: (data: Login, navigate: NavigateFunction) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  passwordError: "",

  clearPasswordError: () => set({ passwordError: "" }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.post("/admin-auth/check");
      set({ authUser: res.data.user });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data: Signup, navigate: NavigateFunction) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/admin-auth/signup", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      navigate("/admin/home");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        set({ passwordError: data?.passwordError });
        if (data?.message) {
          toast.error(data.message);
        }
      }
      console.error("Error caught:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: Login, navigate: NavigateFunction) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/admin-auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      navigate("/home");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/admin-auth/logout");
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },
}));
