import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import LoginPage from "@/app/admin/auth/login-page";
import SignupPage from "@/app/admin/auth/signup-page";
import Dashboard from "@/app/admin/dashboard/page";

import Services from "./app/admin/services/page";
import Schedule from "./app/admin/schedule/page";
import ProtectedRoute from "./components/auth/protected-routes";
import AdminLayout from "@/app/admin/page";
import Profile from "./app/admin/profile/page";

function App() {
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
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Public Pages */}
        <Route path="/admin/signup" element={<SignupPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
