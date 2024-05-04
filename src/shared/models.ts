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
  email: string
  imageUrl?: string
  followings: number
  followers: number
  score: number
}

export type CommentModel = {
  postId: PostModel['id']
  publisher: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>
  commentId: string
  body: string
  date: number
}

export type PostModel = {
  id: string
  publisher: Omit<AccountModel, 'followings' | 'followers' | 'score' | 'email'>
  date: number
  content: string
  likes: number
  comments: CommentModel[]
}
