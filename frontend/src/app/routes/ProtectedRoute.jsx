import { Navigate, useLocation } from "react-router-dom";
import LoadingState from "@/shared/components/LoadingState";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { authLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (authLoading) return <LoadingState message="Verificando sessão..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { authLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (authLoading) return <LoadingState message="Verificando permissão..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
