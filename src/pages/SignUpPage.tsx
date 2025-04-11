import { AppDispatch } from "@/app/store"
import { ProfileImagePicker } from "@/components/Auth/ProfileImagePicker"
import { registerUserAsync } from "@/features/User/usersSlice"
import { recaptchaSiteKey, STORAGE_KEYS } from "@/shared/constants"
import { cn } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { FaLock, FaUser } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { useDispatch } from "react-redux"
import { Link, Navigate, useNavigate } from "react-router-dom"

export const SignUpPage = () => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [bio, setBio] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState("")
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [errors, setErrors] = useState<{
    name?: string
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    bio?: string
    profileImage?: string
    captcha?: string
    general?: string
  }>({})

  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const isAuthenticated = localStorage.getItem(STORAGE_KEYS.AUTH) === "true"

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Handle reCAPTCHA change
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "")
  }

  // Handle reCAPTCHA expiration
  const handleCaptchaExpired = () => {
    setCaptchaToken("")
  }

  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
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
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else {
      // Check for password complexity
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumbers = /[0-9]/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        const missingRequirements = []
        if (!hasUpperCase) missingRequirements.push("uppercase letter")
        if (!hasLowerCase) missingRequirements.push("lowercase letter")
        if (!hasNumbers) missingRequirements.push("number")
        if (!hasSpecialChar) missingRequirements.push("special character")

        newErrors.password = `Password must include at least one ${missingRequirements.join(", ")}`
      }
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Bio validation
    if (bio.length > 150) {
      newErrors.bio = "Bio cannot exceed 150 characters"
    }

    // Captcha validation
    if (!captchaToken) {
      newErrors.captcha = "Please complete the reCAPTCHA verification"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Function to upload profile image
  const uploadProfileImage = async (image: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append("file", image)

      // Use the posts upload endpoint for now - in production, you'd ideally have a dedicated user images endpoint
      const response = await fetch("https://signalist-backend.liara.run/api/upload/users", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        throw new Error("Failed to upload profile image")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading profile image:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if captcha token exists
    if (!captchaToken) {
      setErrors({ captcha: "Please complete the reCAPTCHA verification" })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Upload image if one was selected
      let imageUrl = ""
      if (selectedImage) {
        try {
          imageUrl = await uploadProfileImage(selectedImage)
        } catch (error) {
          setErrors({
            profileImage:
              "Failed to upload profile image. You can continue without an image or try again."
          })
        }
      }

      const resultAction = await dispatch(
        registerUserAsync({
          name,
          username,
          email,
          password,
          imageUrl,
          bio,
          hasPremium: false,
          subscriptionPlan: []
        })
      )

      if (registerUserAsync.fulfilled.match(resultAction)) {
        const user = resultAction.payload

        localStorage.setItem(STORAGE_KEYS.AUTH, "true")
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))

        // Initialize session management
        initializeSession()
        setupActivityListeners()

        navigate("/", { replace: true })
      } else {
        // Registration failed
        const errorMessage = resultAction.error?.message || "Registration failed"
        setErrors({ general: errorMessage })

        // Reset captcha on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setCaptchaToken("")
      }
    } catch (error) {
      console.error("Sign up failed:", error)
      setErrors({ general: "An error occurred during sign up" })
      // Reset captcha on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset()
      }
      setCaptchaToken("")
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

            {/* Profile Image Picker */}
            <ProfileImagePicker
              name={name || "Ex"}
              selectedImage={selectedImage}
              onImageChange={handleImageChange}
              error={errors.profileImage}
            />

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
                {!errors.password && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Password must be at least 8 characters and include uppercase, lowercase, number,
                    and special character.
                  </p>
                )}
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

              {/* Bio field */}
              <div className="relative">
                <div className="flex items-center mb-1">
                  <label htmlFor="bio" className="text-sm text-gray-600 dark:text-gray-300">
                    Bio <span className="text-gray-400">(optional)</span>
                  </label>
                </div>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  maxLength={150}
                  className={cn(
                    "w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary-link-button dark:focus:border-dark-link-button dark:bg-gray-700 dark:border-gray-600 resize-none",
                    errors.bio && "border-red-500 dark:border-red-500"
                  )}
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {bio.length}/150 characters
                </p>
              </div>
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
            {errors.captcha && (
              <p className="text-red-500 text-xs mt-1 text-center">{errors.captcha}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || !captchaToken}
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
