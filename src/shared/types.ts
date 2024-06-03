import RootStore from '@/app/store'
import { AccountModel, CryptoResponseType } from './models'

export type RootState = ReturnType<typeof RootStore.getState>
export type CoinType = CryptoResponseType['data']['coins'][0]
export type StatusType = 'closed' | 'open' | 'not_opened'
export type SimplifiedAccountType = Omit<
  AccountModel,
  'followings' | 'followers' | 'score' | 'email'
>
export type SubscriptionPlanType = { duration: string; price: number }[]
export type SubscriberType = {
  username: AccountModel['username']
  expireDate: number
}
