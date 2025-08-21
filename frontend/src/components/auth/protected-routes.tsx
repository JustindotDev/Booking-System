import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

function ProtectedRoute() {
  const { authUser } = useAuthStore();

  return authUser ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;
