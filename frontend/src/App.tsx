import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/protected-route";
import { TrackSelection } from "@/components/track-selection";
import { useAuth, AuthProvider } from "@/context/auth-context";
import AuthCallback from "@/pages/AuthCallback";
import CheckEmail from "@/pages/CheckEmail";
import DashboardPage from "@/pages/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";

function HomeRoute() {
  const { loading, session } = useAuth();

  if (loading) {
    return null;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/track-selection"
            element={
              <ProtectedRoute>
                <TrackSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireTrack>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
