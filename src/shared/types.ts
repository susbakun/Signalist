import RootStore from '@/app/store'
import { AccountModel, CryptoResponseType } from './models'

export type RootState = ReturnType<typeof RootStore.getState>
export type CoinType = CryptoResponseType['data']['coins'][0]
export type StatusType = 'closed' | 'open' | 'not_opened'
export type SimplifiedAccountType = Omit<
  AccountModel,
  'followings' | 'followers' | 'score' | 'email'
>
type DurationType = '30 days' | '3 months' | '6 months' | '12 months'
export type SubscriptionPlanType = { duration: DurationType; price: number }[]
export type SubscriberType = {
  username: AccountModel['username']
  expireDate: number
}
export type ChatType = { sender: SimplifiedAccountType; text: string; date: number }
