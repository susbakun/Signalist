import { AppDispatch } from "@/app/store"
import { ProfileImagePicker } from "@/components/Auth/ProfileImagePicker"
import { fetchUsersAsync, registerUserAsync } from "@/features/User/usersSlice"
import { backendUrl, recaptchaSiteKey, STORAGE_KEYS } from "@/shared/constants"
import { cn } from "@/utils"
import { initializeSession, setupActivityListeners } from "@/utils/session"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa"
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
  const [showPassword, setShowPassword] = useState(false)
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
  // Check if user is already authenticated via current user data
  const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)

  if (currentUser) {
    return <Navigate to="/home" replace />
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
        newErrors.password =
          "Password must include uppercase, lowercase, number, and special character"
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
      const response = await fetch(`${backendUrl}/upload/users`, {
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
          subscriptionPlan: [],
          blockedUsers: []
        })
      )

      if (registerUserAsync.fulfilled.match(resultAction)) {
        const user = resultAction.payload

        // Store user info (cookies handle authentication now)
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))

        initializeSession()
        setupActivityListeners()

        // Fetch all users to populate the Redux store before navigating
        await dispatch(fetchUsersAsync())

        navigate("/home", { replace: true })
      } else {
        // Registration failed
        const errorMessage = resultAction.error?.message || "Registration failed"

        // Check if error object has a field property
        // @ts-expect-error - Custom field property
        const errorField = resultAction.error?.field

        if (errorField) {
          // Set the error for the specific field
          switch (errorField) {
            case "username":
              setErrors({ username: errorMessage })
              break
            case "email":
              setErrors({ email: errorMessage })
              break
            default:
              setErrors({ general: errorMessage })
          }
        } else if (errorMessage.includes("Username already taken")) {
          setErrors({ username: "This username is already taken. Please choose another." })
        } else if (errorMessage.includes("Email already registered")) {
          setErrors({
            email: "This email is already registered. Please use another email or login."
          })
        } else {
          // General error for other issues
          setErrors({ general: errorMessage })
        }

        // Reset captcha on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset()
        }
        setCaptchaToken("")
      }
    } catch (error) {
      console.error("Sign up failed:", error)

      // Try to extract a useful error message
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during sign up"

      // Check if the error has a field property
      // @ts-expect-error - Custom field property
      const errorField = error instanceof Error ? error.field : undefined

      if (errorField) {
        // Set error for specific field
        switch (errorField) {
          case "username":
            setErrors({ username: errorMessage })
            break
          case "email":
            setErrors({ email: errorMessage })
            break
          default:
            setErrors({ general: errorMessage })
        }
      } else if (errorMessage.includes("Username already taken")) {
        setErrors({ username: "This username is already taken. Please choose another." })
      } else if (errorMessage.includes("Email already registered")) {
        setErrors({ email: "This email is already registered. Please use another email or login." })
      } else {
        setErrors({ general: errorMessage })
      }

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
          <div
            className="px-8 py-6 bg-gradient-to-r from-primary-link-button to-[#10b981]
           dark:from-dark-link-button dark:to-[#059669]"
          >
            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
            <p className="text-gray-100 text-center mt-2">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
            {errors.general && (
              <div
                className="text-red-500 text-sm text-center bg-red-100
               dark:bg-red-900/20 rounded-lg py-2"
              >
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
              {/* Full Name field */}
              <div className="relative mb-6">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none",
                      "focus:border-primary-link-button dark:focus:border-dark-link-button",
                      "dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.name && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Username field */}
              <div className="relative mb-6">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none",
                      "focus:border-primary-link-button dark:focus:border-dark-link-button",
                      "dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.username && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              {/* Email field */}
              <div className="relative mb-6">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <MdEmail className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none",
                      "focus:border-primary-link-button dark:focus:border-dark-link-button",
                      "dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.email && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password field */}
              <div className="relative mb-6">
                <div className="flex items-center">
                  <div className="relative w-full">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none
                  focus:border-primary-link-button dark:focus:border-dark-link-button
                  dark:bg-gray-700 dark:border-gray-600"
                    />
                    <button
                      className="action-button absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-5 h-5" />
                      ) : (
                        <FaEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-xs mt-1 bg-red-50 dark:bg-red-900/10 p-1 rounded">
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 bg-gray-50 dark:bg-gray-700/30 p-1 rounded">
                    Password must be at least 8 characters and include uppercase, lowercase, number,
                    and special character.
                  </p>
                )}
              </div>

              {/* Confirm Password field */}
              <div className="relative mb-6">
                <div className="flex items-center">
                  <div className="absolute left-3 flex items-center justify-center pointer-events-none">
                    <FaLock className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className={cn(
                      "w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none",
                      "focus:border-primary-link-button dark:focus:border-dark-link-button",
                      "dark:bg-gray-700 dark:border-gray-600 h-10",
                      errors.confirmPassword && "border-red-500 dark:border-red-500"
                    )}
                  />
                </div>
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
                    "w-full px-4 py-2 border rounded-lg focus:outline-none",
                    "focus:border-primary-link-button dark:focus:border-dark-link-button",
                    "dark:bg-gray-700 dark:border-gray-600 resize-none",
                    errors.bio && "border-red-500 dark:border-red-500"
                  )}
                />
                <div className="min-h-[1.5rem] flex justify-between">
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {bio.length}/150 characters
                  </p>
                </div>
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
                "w-full py-2 px-4 bg-primary-link-button dark:bg-dark-link-button",
                "text-white rounded-lg hover:opacity-90 transition-opacity mt-6",
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
