import { AccountModel } from "@/shared/models"

export const userIsUserBlocked = (myAccount: AccountModel | undefined) => {
  const isUserBlocked = (username: AccountModel["username"]) => {
    return myAccount?.blockedAccounts.some((user) => user.username === username)
  }

  return {
    isUserBlocked
  }
}
