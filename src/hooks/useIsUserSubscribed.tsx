import { useAppSelector } from "@/features/Post/postsSlice"
import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType, SubscriberType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"

export const useIsUserSubscribed = (publisher: SimplifiedAccountType | AccountModel) => {
  const isSubscribed = (
    myUsername: AccountModel["username"],
    subscribers: SubscriberType[] | undefined
  ) => {
    if (subscribers) return subscribers.some((subscriber) => subscriber.username === myUsername)
  }

  const { users } = useAppSelector((state) => state.users)
  const currentUsername = getCurrentUsername()
  const myAccount = users.find((user) => user.username === currentUsername)!
  const publisherAccount = users.find((user) => user.username === publisher.username)
  const amISubscribed = isSubscribed(myAccount.username, publisherAccount?.subscribers)

  return { amISubscribed }
}
