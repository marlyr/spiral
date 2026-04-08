import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CheckEmail from "@/pages/CheckEmail";
import AuthCallback from "@/pages/AuthCallback";
import { ProtectedRoute } from "@/components/protected-route";
import { TrackSelection } from "@/components/track-selection";
import { Dashboard } from "./components/dashboard";
import { AuthProvider } from "@/context/auth-context";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
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
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
