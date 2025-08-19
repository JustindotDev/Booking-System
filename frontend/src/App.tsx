import { useEffect } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

import LoginPage from "@/app/admin/authentication/login-page";
import SignupPage from "@/app/admin/authentication/signup-page";
import Dashboard from "@/app/admin/dashboard/page";
import { useAuthStore } from "@/store/useAuthStore";
import Services from "./app/admin/services/page";
import Schedule from "./app/admin/schedule/page";

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
        <Route
          path="/admin/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/services"
          element={authUser ? <Services /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/schedule"
          element={authUser ? <Schedule /> : <Navigate to="/admin/login" />}
        />
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
