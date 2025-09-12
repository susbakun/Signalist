import {
  BookmarkType,
  DMRoom,
  GroupRoom,
  SignalAccountType,
  SimplifiedAccountType,
  StatusType,
  SubscriberType,
  SubscriptionPlanType
} from "./types"

// Wallex API Response Type
export type WallexCryptoResponseType = {
  result: {
    markets: WallexCoinType[]
    coin_categories: {
      id: number
      name: string
      name_fa: string
    }[]
  }
  message: string
  success: boolean
}

export type WallexCoinType = {
  symbol: string
  base_asset: string
  quote_asset: string
  fa_base_asset: string
  fa_quote_asset: string
  en_base_asset: string
  en_quote_asset: string
  categories: number[] | null
  price: string
  change_24h: number
  volume_24h: number | null
  change_7D: number
  quote_volume_24h: number | null
  spot_is_new: boolean
  otc_is_new: boolean
  is_new: boolean
  is_spot: boolean
  is_otc: boolean
  is_margin: boolean
  is_tmn_based: boolean
  is_usdt_based: boolean
  is_zero_fee: boolean
  leverage_step: number | null
  max_leverage: number | null
  created_at: string
  amount_precision: number
  price_precision: number
  flags: string[]
  is_market_type_enable: boolean
}

export type CryptoResponseType = {
  status: string
  data: {
    stats: {
      total24hVolume: number
      totalMarketCap: number
      totalExchanges: number
      total: number
      totalMarkets: number
    }
    coins: {
      uuid: string
      rank: number
      symbol: string
      change: string
      marketCap: string
      price: string
      iconUrl: string
      name: string
      "24hVolume": string
    }[]
  }
}

export type NewsSource = {
  title: string
  region: string
  domain: string
  path: string | null
  type: string
}


export type AccountModel = {
  name: string
  username: string
  email: string
  password: string
  imageUrl?: string
  bio?: string
  score: number
  subscribers?: SubscriberType[]
  subscriptionPlan?: SubscriptionPlanType
  hasPremium: boolean
  followings: SimplifiedAccountType[]
  followers: SimplifiedAccountType[]
  bookmarks: BookmarkType
  blockedUsers: SimplifiedAccountType[]
}

export type CommentModel = {
  id: string
  postId: PostModel["id"]
  commentId: string
  body: string
  likes: SimplifiedAccountType[]
  date: number
  publisher: SimplifiedAccountType
}

export type PostModel = {
  id: string
  content: string
  date: number
  likes: SimplifiedAccountType[]
  comments: CommentModel[]
  isPremium: boolean
  user: SimplifiedAccountType
  postImageHref?: string
}

export type SignalModel = {
  id: string
  market: {
    name: string
    uuid: string
    quoteAsset?: string
  }
  entry: number
  stoploss: number
  targets: { id: string; value: number; touched: boolean | undefined }[]
  openTime: number
  closeTime: number
  status: StatusType
  date: number
  likes: SimplifiedAccountType[]
  description?: string
  chartImageHref?: string
  isPremium: boolean
  user: SignalAccountType
  score: number
}

export type MessageModel = {
  [username: AccountModel["username"]]: {
    [k: string]: DMRoom | GroupRoom
  }
}
