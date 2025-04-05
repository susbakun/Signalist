import {
  AppContent,
  AppSideBar,
  AuthLayout,
  MobileNavbar,
  ProtectedRoute,
  RootLayout
} from "@/components"
import { LoginPage, SignUpPage } from "@/pages"
import { UserPage } from "@/pages/UserPage"
import { STORAGE_KEYS } from "@/shared/constants"
import { toggleThemeMode } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"

function App() {
  useEffect(() => {
    const themeMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) || "Os Default"
    toggleThemeMode(themeMode)

    // Initialize session management
    if (localStorage.getItem(STORAGE_KEYS.AUTH) === "true") {
      initializeSession()
      setupActivityListeners()
    }
  }, [])

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <RootLayout className="flex">
              <AppSideBar />
              <AppContent />
              <MobileNavbar />
            </RootLayout>
          </ProtectedRoute>
        }
        path="/*"
      />
      <Route path="/profile" element={<UserPage />} />
    </Routes>
  )
}

export default App
