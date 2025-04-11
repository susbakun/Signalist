import { recaptchaSiteKey, STORAGE_KEYS } from "@/shared/constants"
import { cn } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { FaLock, FaUser } from "react-icons/fa"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { fetchUsersAsync, loginUserAsync } from "@/features/User/usersSlice"

export const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [captchaToken, setCaptchaToken] = useState("")
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true"

  // Handle reCAPTCHA change
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "")
  }

  // Handle reCAPTCHA expiration
  const handleCaptchaExpired = () => {
    setCaptchaToken("")
  }

  // Reset reCAPTCHA
  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
      setCaptchaToken("")
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if captcha token exists
      if (!captchaToken) {
        setError("Please complete the reCAPTCHA verification")
        setIsLoading(false)
        return
      }

      // Use the login thunk
      const resultAction = await dispatch(loginUserAsync({ email, password }))

      if (loginUserAsync.fulfilled.match(resultAction)) {
        // Login successful
        const user = resultAction.payload

        // Store user info and auth status
        localStorage.setItem(STORAGE_KEYS.AUTH, "true")
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(user) // Store the complete user object
        )

        // Initialize session management
        initializeSession()
        setupActivityListeners()

        // Fetch all users to populate the Redux store before navigating
        await dispatch(fetchUsersAsync())

        navigate("/", { replace: true })
      } else {
        // Login failed
        const errorMessage = resultAction.error?.message || "Invalid email or password"
        setError(errorMessage)
        resetCaptcha() // Reset captcha on failed login
      }
    } catch (error) {
      console.error("Login failed:", error)
      setError("An error occurred during login")
      resetCaptcha() // Reset captcha on error
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

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/20 rounded-lg py-2">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none
                  focus:border-primary-link-button dark:focus:border-dark-link-button
                  dark:bg-gray-700 dark:border-gray-600"
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

            {/* reCAPTCHA component */}
            <div className="flex justify-center mt-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={handleCaptchaChange}
                onExpired={handleCaptchaExpired}
                theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
              />
            </div>
            {error && error.includes("reCAPTCHA") && (
              <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !captchaToken}
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
