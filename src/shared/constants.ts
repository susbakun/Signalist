export const demoImageUrl = "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"
export const messagesRouteRegExp = /\/messages\/?/
export const editPostRouteRegExp = /\/(explore\/)?(suggests|posts)\/editPost\/.*/
export const tradingviewSupportHost = "https://www.tradingview.com"
export const nobitexMarketChart = "https://nobitex.ir/nobitex-cdn/charts/"
export const appwriteEndpoint = "https://cloud.appwrite.io/v1"
export const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
export const appwritePostsBucketId = import.meta.env.VITE_APPWRITE_POSTS_BUCKET_ID
export const appwriteSignalsBucketId = import.meta.env.VITE_APPWRITE_SIGNALS_BUCKET_ID
export const appwriteMessagesBucketId = import.meta.env.VITE_APPWRITE_MESSAGES_BUCKET_ID

// Storage Keys
export const STORAGE_KEYS = {
  WATCHLIST: "user_watchlist",
  LAST_ACTIVITY: "lastActivityTime",
  AUTH: "isAuthenticated",
  CURRENT_USER: "currentUser",
  THEME_MODE: "themeMode"
} as const

export const cryptoNewsCategories = [
  { value: "Bitcoin", label: "Bitcoin" },
  { value: "Ethereum", label: "Ethereum" },
  { value: "Ripple", label: "Ripple" },
  { value: "Litecoin", label: "Litecoin" },
  { value: "Cardano", label: "Cardano" },
  { value: "Polkadot", label: "Polkadot" },
  { value: "Binance Coin", label: "Binance Coin" },
  { value: "Solana", label: "Solana" },
  { value: "Dogecoin", label: "Dogecoin" },
  { value: "Shiba Inu", label: "Shiba Inu" }
]

export const cryptoNewsSources = [
  { value: "CoinTelegraph", label: "CoinTelegraph" },
  { value: "CryptoSlate", label: "CryptoSlate" },
  { value: "NewsBTC", label: "NewsBTC" },
  { value: "Decrypt", label: "Decrypt" },
  { value: "Bitcoin Magazine", label: "Bitcoin Magazine" },
  { value: "CoinDesk", label: "CoinDesk" },
  { value: "The Block", label: "The Block" },
  { value: "U.Today", label: "U.Today" },
  { value: "CryptoBriefing", label: "CryptoBriefing" },
  { value: "AMBCrypto", label: "AMBCrypto" }
]
