import { useAppSelector } from "@/features/User/usersSlice"
import { STORAGE_KEYS } from "@/shared/constants"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Loader } from "./Shared/Loader"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true" // This is temporary, replace with your auth logic
  const location = useLocation()
  const { loading } = useAppSelector((state) => state.users)

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (loading) {
    return <Loader className="h-screen" />
  }

  return <>{children}</>
}

export const AuthLayout = () => {
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true"
  const location = useLocation()

  // If user is already authenticated, redirect to home or intended page
  if (isAuthenticated) {
    const intendedPath = location.state?.from?.pathname || "/"
    return <Navigate to={intendedPath} replace />
  }

  return (
    <div className="min-h-screen bg-primary-main dark:bg-dark-main">
      <Outlet />
    </div>
  )
}
