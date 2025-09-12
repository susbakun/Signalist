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
  id: string
  sender: SimplifiedAccountType
  text: string
  date: number
  messageImageHref?: string // Full URL to the message image stored in the backend
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

// Filters used for Signals listing pages
export type SignalsFilterStatus = StatusType | ""
export type SignalsFilters = {
  market?: string
  openFrom?: number | null
  openTo?: number | null
  closeFrom?: number | null
  closeTo?: number | null
  status?: SignalsFilterStatus
}

export type CreateSignalInputsErrors = {
  entry: string
  stoploss: string
  openTime: string
  closeTime: string
  targets: string
}
