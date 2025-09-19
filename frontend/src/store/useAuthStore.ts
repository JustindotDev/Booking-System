import { type NavigateFunction } from "react-router-dom";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios-instance";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

type Signup = Login & {
  username: string;
};

type Login = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  username?: string;
  profile_pic?: string;
  email: string;
};

type AuthStore = {
  authUser: User | null;
  isCheckingAuth: boolean;
  isAuthenticated: boolean | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isUploading: boolean;
  passwordError: string;
  clearPasswordError: () => void;
  checkAuth: () => Promise<void>;
  signUp: (data: Signup, navigate: NavigateFunction) => Promise<void>;
  login: (data: Login, navigate: NavigateFunction) => Promise<void>;
  logout: (navigate: NavigateFunction) => Promise<void>;
  uploadProfilePic: (data: string | null | ArrayBuffer) => Promise<void>;
};

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleRefresh(token: string) {
  const { exp } = jwtDecode<{ exp: number }>(token);
  const expiresIn = exp * 1000 - Date.now();

  if (expiresIn <= 60000) return;

  // refresh 30s before expiry
  refreshTimer = setTimeout(async () => {
    try {
      // don’t refresh if logged out
      if (useAuthStore.getState().authUser === null) {
        return;
      }

      const res = await axiosInstance.post("/admin-auth/refresh");
      const newAccessToken = res.data.accessToken;

      // ✅ Update auth store directly (no /check call)
      useAuthStore.setState((state) => ({
        ...state,
        isAuthenticated: true,
        // optionally store token if you keep it in state
      }));

      scheduleRefresh(newAccessToken);
    } catch (err) {
      console.error("❌ Refresh failed:", err);
      useAuthStore.setState({ authUser: null, isAuthenticated: false });
      stopRefresh();
    }
  }, expiresIn - 60000);
}

function stopRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isAuthenticated: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUploading: false,

  passwordError: "",

  clearPasswordError: () => set({ passwordError: "" }),

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/admin-auth/check");
      set({ authUser: res.data.user, isAuthenticated: true });
      scheduleRefresh(res.data.accessToken);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(error.response?.data.message);
      }
      set({ authUser: null, isAuthenticated: false });
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
      navigate("/admin/dashboard");
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

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
        return;
      }

      set({ authUser: res.data.user, isAuthenticated: true });
      scheduleRefresh(res.data.accessToken);
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (navigate: NavigateFunction) => {
    try {
      const res = await axiosInstance.post("/admin-auth/logout");
      set({ authUser: null, isAuthenticated: false });
      stopRefresh();
      navigate("/admin/login");
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    }
  },

  uploadProfilePic: async (data) => {
    set({ isUploading: true });
    try {
      const res = await axiosInstance.put("/admin-auth/upload-profile-pic", {
        profile_pic: data,
      });
      set((state) => ({
        authUser: state.authUser
          ? {
              ...state.authUser,
              profile_pic: res.data.publicUrl,
            }
          : null,
      }));
      toast.success(res.data.message);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
      console.error("Error caught:", error);
    } finally {
      set({ isUploading: false });
    }
  },
}));
