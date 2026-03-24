import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import { ProtectedRoute } from "@/components/protected-route"
import { TrackSelection } from "@/components/track-selection"
import { Dashboard } from "./components/dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
    </BrowserRouter>
  )
}

export default App
