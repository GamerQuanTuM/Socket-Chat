import { BrowserRouter, Routes, Route } from "react-router-dom"

import { ProtectedRoute } from "./components"
import { Auth, Home } from "./pages"
import { useUser } from "./hooks/useUser"
import { SocketProvider } from "./context/socket"

export default function App() {
  const { user } = useUser()
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <SocketProvider>
              <ProtectedRoute user={user} />
            </SocketProvider>
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          path="/auth"
          element={
            <ProtectedRoute user={!user} redirect="/">
              <Auth />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
