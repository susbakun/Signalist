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
    symbols: {
      [key: string]: WallexCoinType
    }
  }
  message: string
  success: boolean
}

export type WallexCoinType = {
  symbol: string
  baseAsset: string
  baseAsset_png_icon: string
  baseAsset_svg_icon: string
  baseAssetPrecision: number
  quoteAsset: string
  quoteAsset_png_icon: string
  quoteAsset_svg_icon: string
  quotePrecision: number
  faName: string
  enName: string
  faBaseAsset: string
  enBaseAsset: string
  faQuoteAsset: string
  enQuoteAsset: string
  stepSize: number
  tickSize: number
  minQty: number
  minNotional: number
  stats: {
    bidPrice: string
    askPrice: string
    "24h_ch": number | string
    "7d_ch": number | string
    "24h_volume": string
    "7d_volume": string
    "24h_quoteVolume": string
    "24h_highPrice": string
    "24h_lowPrice": string
    lastPrice: string
    lastQty: string
    lastTradeSide: string
    bidVolume: string
    askVolume: string
    bidCount: number | string
    askCount: number | string
    direction: {
      SELL: number
      BUY: number
    }
    "24h_tmnVolume": string
  }
  createdAt: string
  isNew: boolean
  isZeroFee: boolean
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

export type CryptoDetailsResponseType = {
  data: {
    coin: {
      uuid: string
      rank: number
      change: string
      marketCap: string
      price: string
      iconUrl: string
      name: string
      description: string
      "24hVolume": string
      slug: string
      allTimeHigh: {
        price: string
      }
      numberOfMarkets: number
      numberOfExchanges: number
      supply: {
        confirmed: boolean
        circulating: string
        total: string
      }
      links: {
        name: string
        url: string
        type: string
      }[]
    }
  }
}

export type CoinHistoryResponseType = {
  data: {
    change: number
    history: {
      price: string
      timestamp: number
    }[]
  }
}

export type NewsItem = {
  title: string
  url: string
  imageurl: string
  body: string
  published_on: number
  source: string
  isCompatMode?: boolean
}

export type CryptoNewsType = {
  Data: NewsItem[]
  Type: number
}

export type NewsSource = {
  id: string
  name: string
}

export type NewsArticle = {
  source: NewsSource
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  content: string
}

export type NewsApiResponse = {
  status: string
  totalResults: number
  articles: NewsArticle[]
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
  blockedAccounts: SimplifiedAccountType[]
}

export type CommentModel = {
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
  publisher: SimplifiedAccountType
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
  publisher: SignalAccountType
}

export type MessageModel = {
  [username: AccountModel["username"]]: {
    [k: string]: DMRoom | GroupRoom
  }
}
