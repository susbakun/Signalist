import { useAppSelector } from '@/features/Post/postsSlice'
import { AccountModel } from '@/shared/models'
import { SimplifiedAccountType, SubscriberType } from '@/shared/types'

export const useIsUserSubscribed = (publisher: SimplifiedAccountType | AccountModel) => {
  const isSubscribed = (
    myUsername: AccountModel['username'],
    subscribers: SubscriberType[] | undefined
  ) => {
    if (subscribers) return subscribers.some((subscriber) => subscriber.username === myUsername)
  }

  const users = useAppSelector((state) => state.users)
  const me = users.find((user) => user.username === 'Amir_Aryan')!
  const publisherAccount = users.find((user) => user.username === publisher.username)
  const amISubscribed = isSubscribed(me.username, publisherAccount?.subscribers)

  return { amISubscribed }
}
