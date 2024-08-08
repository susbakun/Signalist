import RootStore from "@/app/store"
import { AccountModel, CryptoResponseType, PostModel, SignalModel } from "./models"

export type RootState = ReturnType<typeof RootStore.getState>
export type CoinType = CryptoResponseType["data"]["coins"][0]
export type StatusType = "closed" | "open" | "not_opened"
export type SimplifiedAccountType = Pick<AccountModel, "name" | "username" | "imageUrl">
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
  messageImageId?: string
}
export type BookmarkType = { signals: SignalModel[]; posts: PostModel[] }
export type ThemeModeType = "Os Default" | "Dark" | "Light"
