import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import { TrackSelection } from "@/components/track-selection"
import { Dashboard } from "./components/dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track-selection" element={<TrackSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
