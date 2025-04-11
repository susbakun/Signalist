import { useAppSelector } from "@/features/User/usersSlice"
import { AccountModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { useEffect, useState } from "react"

export const useCurrentUser = () => {
  const { users, loading } = useAppSelector((state) => state.users)
  const [currentUser, setCurrentUser] = useState<AccountModel | null>(null)
  const username = getCurrentUsername()

  useEffect(() => {
    if (users.length > 0 && username) {
      const user = users.find((user: AccountModel) => user.username === username)
      setCurrentUser(user || null)
    }
  }, [users, username])

  return {
    currentUser,
    isAuthenticated: !!username,
    username,
    loading
  }
}
