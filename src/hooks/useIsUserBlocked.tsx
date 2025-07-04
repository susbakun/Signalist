import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"

export const useIsUserBlocked = (myAccount: AccountModel | null) => {
  const isUserBlocked = (username: SimplifiedAccountType["username"]) => {
    return myAccount?.blockedAccounts.some((blockedAccount) => blockedAccount.username === username)
  }

  const areYouBlocked = (uesr: AccountModel) => {
    return uesr.blockedAccounts.some((user) => user.username === myAccount?.username)
  }
  return {
    isUserBlocked,
    areYouBlocked
  }
}
