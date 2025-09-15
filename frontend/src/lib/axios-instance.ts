import axios from "axios";
import { useNavigate } from "react-router-dom";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const navigate = useNavigate();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/logout") &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // Refresh the access token
        await axiosInstance.post("/admin-auth/refresh");
        // Retry original request
        return axiosInstance(originalRequest);
      } catch {
        navigate("/admin/login");
        return Promise.reject(null);
        // optionally clear auth state in store here if refresh fails
      }
    }

    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/admin-auth/refresh")
    ) {
      // prevent Axios from spamming console.error
      // only log if refresh also fails
      return Promise.reject(null);
    }

    return Promise.reject(error);
  }
);
