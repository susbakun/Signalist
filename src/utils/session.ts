import { STORAGE_KEYS } from "@/shared/constants"

const SESSION_TIMEOUT = 60 * 60 * 1000 // 60 minutes

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

  if (currentTime - lastActivity > SESSION_TIMEOUT) {
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

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH)
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY)
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
