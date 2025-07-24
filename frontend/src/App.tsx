import { useEffect } from "react";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

import LoginPage from "@/app/authentication/login-page";
import SignupPage from "@/app/authentication/signup-page";
import Dashboard from "@/app/dashboard/dashboard-page";
import { useAuthStore } from "@/store/useAuthStore";

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
        <Route
          path="/admin/home"
          element={authUser ? <Dashboard /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/admin/home" />}
        />
        <Route
          path="/admin/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/admin/home" />}
        />
      </Routes>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
