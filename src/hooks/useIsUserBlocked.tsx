import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"

export const useIsUserBlocked = (myAccount: AccountModel | null) => {
  const isUserBlocked = (username: SimplifiedAccountType["username"]) => {
    return myAccount?.blockedUsers.some((blockedAccount) => blockedAccount.username === username)
  }

  const areYouBlocked = (user: AccountModel) => {
    return user.blockedUsers.some((user) => user.username === myAccount?.username)
  }
  return {
    isUserBlocked,
    areYouBlocked
  }
}
