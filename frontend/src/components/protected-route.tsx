import { Navigate } from "react-router-dom";

// TODO: handle invalid/expired tokens
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
