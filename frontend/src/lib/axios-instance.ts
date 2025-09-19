import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/signup")
    ) {
      return Promise.reject(error);
    }

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
        window.location.href = "/admin/login";
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
