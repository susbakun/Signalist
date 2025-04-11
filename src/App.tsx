import {
  AppContent,
  AppSideBar,
  AuthLayout,
  MobileNavbar,
  ProtectedRoute,
  RootLayout
} from "@/components"
import { AppDispatch } from "@/app/store"
import { fetchUsersAsync, getUserByUsernameAsync } from "@/features/User/usersSlice"
import { LoginPage, SignUpPage } from "@/pages"
import { UserPage } from "@/pages/UserPage"
import { STORAGE_KEYS } from "@/shared/constants"
import { toggleThemeMode } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Route, Routes } from "react-router-dom"

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const themeMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) || "Os Default"
    toggleThemeMode(themeMode)

    // Initialize session management
    if (localStorage.getItem(STORAGE_KEYS.AUTH) === "true") {
      initializeSession()
      setupActivityListeners()

      // Fetch users when the app initializes and user is authenticated
      dispatch(fetchUsersAsync())

      // Also fetch the current user specifically to ensure it's in the Redux store
      const currentUsername = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "{}").username
        : null

      if (currentUsername) {
        dispatch(getUserByUsernameAsync(currentUsername))
      }
    }
  }, [dispatch])

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
