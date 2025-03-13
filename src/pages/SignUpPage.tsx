import { RootState } from "@/app/store"
import { addUser } from "@/features/User/usersSlice"
import { STORAGE_KEYS } from "@/shared/constants"
import { AccountModel } from "@/shared/models"
import { cn } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { motion } from "framer-motion"
import { useState } from "react"
import { FaLock, FaUser } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate, useNavigate } from "react-router-dom"

export const SignUpPage = () => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.users)
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true"

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces"
    } else if (users.some((user: AccountModel) => user.username === username)) {
      newErrors.username = "Username already exists"
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    } else if (users.some((user: AccountModel) => user.email === email)) {
      newErrors.email = "Email already exists"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Create new user object
      const newUser: AccountModel = {
        name,
        username,
        email,
        password,
        score: 0,
        hasPremium: false,
        followers: [],
        followings: [],
        blockedAccounts: [],
        bookmarks: { signals: [], posts: [] }
      }

      // Dispatch action to add user to Redux store
      dispatch(addUser(newUser))

      // Store user info and auth status
      localStorage.setItem(STORAGE_KEYS.AUTH, "true")
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify({
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          imageUrl: newUser.imageUrl,
          hasPremium: newUser.hasPremium,
          followers: [],
          followings: []
        })
      )

      // Initialize session management
      initializeSession()
      setupActivityListeners()

      navigate("/", { replace: true })
    } catch (error) {
      console.error("Sign up failed:", error)
      setErrors({ general: "An error occurred during sign up" })
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
            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
            <p className="text-gray-100 text-center mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {errors.general && (
              <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 rounded-lg py-2">
                {errors.general}
              </div>
            )}

            <div className="space-y-4">
              {/* Name field */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600",
                    errors.name && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Username field */}
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600",
                    errors.username && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Email field */}
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600",
                    errors.email && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password field */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600",
                    errors.password && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password field */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className={cn(
                    "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600",
                    errors.confirmPassword && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full py-2 px-4 bg-primary-link-button dark:bg-dark-link-button text-white rounded-lg hover:opacity-90 transition-opacity mt-6",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-link-button dark:text-dark-link-button font-medium hover:opacity-80"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
