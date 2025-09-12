import { useAppSelector } from "@/features/User/usersSlice"
import { getUserByUsername } from "@/services/usersApi"
import { AccountModel } from "@/shared/models"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const useUserAccount = (providedUsername?: string) => {
  const { users, loading } = useAppSelector((state) => state.users)
  const params = useParams()
  const username = providedUsername ?? params.username

  const [userAccount, setUserAccount] = useState<AccountModel | null>(null)
  const [userAccountLoading, setUserAccountLoading] = useState(false)

  useEffect(() => {
    const fetchUserAccount = async () => {
      if (!username) return

      try {
        setUserAccountLoading(true)
        const user = await getUserByUsername(username)
        setUserAccount(user)
      } catch (error) {
        console.error("Error fetching user by username:", error)
        if (users.length > 0) {
          const user = users.find((u: AccountModel) => u.username === username)
          setUserAccount(user || null)
        }
      } finally {
        setUserAccountLoading(false)
      }
    }

    fetchUserAccount()
  }, [username, users])

  return {
    userAccount,
    username,
    loading: loading || userAccountLoading
  }
}
