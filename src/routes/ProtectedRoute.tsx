import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthState } from "@/context/AuthContext";
import type { AccountType } from "@/types/domain";

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: AccountType[] }) {
  const { isAuthenticated, user } = useAuthState();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles?.length && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
