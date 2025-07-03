import { STORAGE_KEYS } from "@/shared/constants"
import { logoutUser as apiLogoutUser } from "@/services/usersApi"

const STANDARD_SESSION_TIMEOUT = 24 * 60 * 60 * 1000 // 60 minutes
const EXTENDED_SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000 // 30 days

export const initializeSession = () => {
  updateLastActivity()
  startSessionTimer()
}

export const updateLastActivity = () => {
  localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
}

export const checkSession = () => {
  const lastActivity = Number(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY))
  const currentTime = Date.now()
  const isExtendedSession = localStorage.getItem(STORAGE_KEYS.EXTENDED_SESSION) === "true"

  // Choose timeout based on whether "Remember Me" was selected
  const sessionTimeout = isExtendedSession ? EXTENDED_SESSION_TIMEOUT : STANDARD_SESSION_TIMEOUT

  if (currentTime - lastActivity > sessionTimeout) {
    logout()
    return false
  }
  return true
}

export const startSessionTimer = () => {
  // Check session every minute
  setInterval(() => {
    if (!checkSession()) {
      window.location.href = "/login"
    }
  }, 60 * 1000)
}

export const logout = async () => {
  try {
    // Call the backend logout API to clear cookies
    await apiLogoutUser()
  } catch (error) {
    console.error("Error calling logout API:", error)
    // Continue with local cleanup even if API call fails
  }

  // Clear all auth data but preserve rememberedEmail for user convenience
  const wasRemembered = localStorage.getItem(STORAGE_KEYS.REMEMBERED_AUTH) === "true"

  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
  localStorage.removeItem(STORAGE_KEYS.EXTENDED_SESSION)

  // If not explicitly remembered, remove those credentials too
  if (!wasRemembered) {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL)
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_AUTH)
  }
}

// Event listeners for user activity
export const setupActivityListeners = () => {
  const events = ["mousedown", "keydown", "scroll", "touchstart"]

  events.forEach((event) => {
    document.addEventListener(event, updateLastActivity)
  })

  // Update activity on page visibility change (tab focus)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (!checkSession()) {
        window.location.href = "/login"
      } else {
        updateLastActivity()
      }
    }
  })
}
