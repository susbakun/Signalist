import { usersMock } from "@/assets/mocks"
import { STORAGE_KEYS } from "@/shared/constants"
import { cn } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { motion } from "framer-motion"
import { useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const [identifier, setIdentifier] = useState("") // This will hold either email or username
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true"
  const from = location.state?.from?.pathname || "/"

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if the identifier is an email or username
      const isEmail = identifier.includes("@")

      // Find user with matching email/username and password
      const user = usersMock.find(
        (user) =>
          (isEmail ? user.email === identifier : user.username === identifier) &&
          user.password === password
      )

      if (user) {
        // Store user info and auth status
        localStorage.setItem(STORAGE_KEYS.AUTH, "true")
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify({
            name: user.name,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            hasPremium: user.hasPremium,
            followers: user.followers,
            followings: user.followings
          })
        )

        // Initialize session management
        initializeSession()
        setupActivityListeners()

        navigate(from, { replace: true })
      } else {
        setError("Invalid username/email or password")
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-main dark:bg-dark-main p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-primary-link-button to-[#10b981] dark:from-dark-link-button dark:to-[#059669]">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back!</h2>
            <p className="text-gray-100 text-center mt-2">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 rounded-lg py-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username or Email"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary-link-button dark:text-dark-link-button rounded"
                />
                <span className="text-gray-600 dark:text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-link-button dark:text-dark-link-button hover:opacity-80"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2 px-4 bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg hover:opacity-90 transition-opacity",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary-link-button dark:text-dark-link-button font-medium hover:opacity-80"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
