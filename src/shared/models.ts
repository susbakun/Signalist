import { StatusType } from './types'

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
      '24hVolume': string
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
      '24hVolume': string
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

export type CryptoNewsType = {
  articles: {
    title: string
    url: string
    urlToImage: string
    publishedAt: string
    description: string
  }[]
}

export type AccountModel = {
  name: string
  username: string
  bio?: string
  subscribed?: boolean
  hasPremium?: boolean
  email: string
  imageUrl?: string
  followings: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>[]
  followers: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>[]
  score: number
}

export type CommentModel = {
  postId: PostModel['id']
  publisher: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>
  commentId: string
  body: string
  likes: number
  date: number
}

export type PostModel = {
  id: string
  publisher: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>
  date: number
  content: string
  likes: number
  isPremium: boolean
  subscribed?: boolean
  comments: CommentModel[]
}

export type SignalModel = {
  id: string
  market: {
    name: string
    uuid: string
  }
  publisher: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>
  entry: number
  stoploss: number
  targets: { id: string; value: number; touched: boolean | undefined }[]
  openTime: number
  closeTime: number
  date: number
  subscribed?: boolean
  description?: string
  likes: number
  showChart: boolean
  isPremium: boolean
  status: StatusType
}
