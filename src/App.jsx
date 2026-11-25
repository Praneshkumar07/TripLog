import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { TOKEN_KEY } from './api.js'

function ProtectedRoute({ children }) {
  return localStorage.getItem(TOKEN_KEY)
    ? children
    : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
