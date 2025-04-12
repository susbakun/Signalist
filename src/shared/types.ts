import RootStore from "@/app/store"
import { AccountModel, CryptoResponseType } from "./models"

export type RootState = ReturnType<typeof RootStore.getState>
export type CoinType = CryptoResponseType["data"]["coins"][0] & {
  quoteAsset?: string // Optional field to store the quote asset (USDT, TMN, etc.)
}
export type StatusType = "closed" | "open" | "not_opened"
export type SimplifiedAccountType = Pick<AccountModel, "name" | "username" | "imageUrl">
export type GroupInfoType = {
  groupName: string
  groupImageHref?: string // Full URL to the group image stored in the backend
}
export type SignalAccountType = SimplifiedAccountType & { score: AccountModel["score"] }
type DurationType = "30 days" | "3 months" | "6 months" | "12 months"
export type SubscriptionPlanType = { duration: DurationType; price: number }[]
export type SubscriberType = {
  username: AccountModel["username"]
  expireDate: number
}
export type ChatType = {
  sender: SimplifiedAccountType
  text: string
  date: number
  messageImageHref?: string // Full URL to the message image stored in the backend
  id?: string // Unique message ID
  pending?: boolean // Flag to indicate if the message is still being processed
  updated_at?: number // Timestamp of the last message update
}
export type DMRoom = {
  userInfo: SimplifiedAccountType
  messages: ChatType[]
  usersInfo: null
  groupInfo: null
  isGroup: false
}

export type GroupRoom = {
  usersInfo: SimplifiedAccountType[]
  messages: ChatType[]
  groupInfo: GroupInfoType
  userInfo: null
  isGroup: true
}
export type BookmarkType = {
  signals: string[] // Just signal IDs
  posts: string[] // Just post IDs
}
export type ThemeModeType = "Os Default" | "Dark" | "Light"
export type OptionType = {
  value: string
  label: string
}
