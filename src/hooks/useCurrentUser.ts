import { RootState } from "@/app/store"
import { AccountModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { useSelector } from "react-redux"

export const useCurrentUser = () => {
  const currentUser = useSelector((state: RootState) =>
    state.users.find((user: AccountModel) => user.username === getCurrentUsername())
  )

  return {
    currentUser,
    isAuthenticated: !!getCurrentUsername(),
    username: getCurrentUsername()
  }
}
