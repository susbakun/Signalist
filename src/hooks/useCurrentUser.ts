import { useAppSelector } from "@/features/User/usersSlice"
import { AccountModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"
import { getCurrentUser as getCurrentUserApi } from "@/services/usersApi"

export const useCurrentUser = () => {
  const { users, loading: initialLoading } = useAppSelector((state) => state.users)
  const [currentUser, setCurrentUser] = useState<AccountModel | null>(null)
  const [currentUserLoading, setCurrentUserLoading] = useState(false)
  const username = getCurrentUsername()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!username) return

      try {
        setCurrentUserLoading(true)
        const user = await getCurrentUserApi()
        setCurrentUser(user)
      } catch (error) {
        console.error("Error fetching current user:", error)
        // Fallback to finding user from users array if API call fails
        if (users.length > 0) {
          const user = users.find((user: AccountModel) => user.username === username)
          setCurrentUser(user || null)
        }
      } finally {
        setCurrentUserLoading(false)
      }
    }

    fetchCurrentUser()
  }, [username, users])

  return {
    currentUser,
    isAuthenticated: !!username,
    username,
    initialLoading,
    currentUserLoading: currentUserLoading
  }
}
