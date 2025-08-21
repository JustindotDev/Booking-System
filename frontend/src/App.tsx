import { useEffect } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

import LoginPage from "@/app/admin/auth/login-page";
import SignupPage from "@/app/admin/auth/signup-page";
import Dashboard from "@/app/admin/dashboard/page";
import { useAuthStore } from "@/store/useAuthStore";
import Services from "./app/admin/services/page";
import Schedule from "./app/admin/schedule/page";
import ProtectedRoute from "./components/auth/protected-routes";
import AdminLayout from "@/app/admin/page";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<Services />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>
        </Route>

        {/* Public Pages */}
        <Route
          path="/admin/signup"
          element={
            !authUser ? <SignupPage /> : <Navigate to="/admin/dashboard" />
          }
        />
        <Route
          path="/admin/login"
          element={
            !authUser ? <LoginPage /> : <Navigate to="/admin/dashboard" />
          }
        />
      </Routes>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
