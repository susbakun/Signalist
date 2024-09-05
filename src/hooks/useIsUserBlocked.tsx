import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"

export const useIsUserBlocked = (myAccount: AccountModel | undefined) => {
  const isUserBlocked = (username: SimplifiedAccountType["username"]) => {
    return myAccount?.blockedAccounts.some((blockedAccount) => blockedAccount.username === username)
  }
  return {
    isUserBlocked
  }
}
