import { useAppSelector } from "@/features/User/usersSlice"
import { STORAGE_KEYS } from "@/shared/constants"
import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Loader } from "./Shared/Loader"
import { getCurrentUser as apiGetCurrentUser } from "@/services/usersApi"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const location = useLocation()
  const { loading } = useAppSelector((state) => state.users)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Try to fetch current user data - this will fail if not authenticated
        const user = await apiGetCurrentUser()
        // Update localStorage with fresh user data
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
        setIsAuthenticated(true)
      } catch (error) {
        // If API call fails, user is not authenticated
        setIsAuthenticated(false)
        // Clear localStorage auth data
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuthentication()
  }, [])

  if (isChecking || loading) {
    return <Loader className="h-screen" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export const AuthLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Try to fetch current user data
        await apiGetCurrentUser()
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuthentication()
  }, [])

  if (isChecking) {
    return <Loader className="h-screen" />
  }

  // If user is already authenticated, redirect to home or intended page
  if (isAuthenticated) {
    const intendedPath = location.state?.from?.pathname || "/home"
    return <Navigate to={intendedPath} replace />
  }

  return (
    <div className="min-h-screen bg-primary-main dark:bg-dark-main">
      <Outlet />
    </div>
  )
}
