import { AppContent, AppSideBar, AuthLayout, ProtectedRoute, RootLayout } from "@/components"
import { LoginPage, SignUpPage } from "@/pages"
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
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        {/* Add more auth routes like forgot-password here */}
      </Route>

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <RootLayout className="flex">
              <AppSideBar />
              <AppContent />
            </RootLayout>
          </ProtectedRoute>
        }
        path="/*"
      />
    </Routes>
  )
}

export default App
