export const demoImageUrl = "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News"
export const messagesRouteRegExp = /\/messages\/?/
export const editPostRouteRegExp = /\/(explore\/)?(suggests|posts)\/editPost\/.*/
export const tradingviewSupportHost = "https://www.tradingview.com"
export const nobitexMarketChart = "https://nobitex.ir/nobitex-cdn/charts/"
export const newsApiKey = import.meta.env.VITE_NEWS_API_KEY
export const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
export const backendUrl = "https://signalist-backend.liara.run/api"

// Storage Keys
export const STORAGE_KEYS = {
  WATCHLIST: "user_watchlist",
  LAST_ACTIVITY: "lastActivityTime",
  AUTH: "isAuthenticated",
  CURRENT_USER: "currentUser",
  THEME_MODE: "themeMode",
  REMEMBERED_EMAIL: "rememberedEmail",
  REMEMBERED_AUTH: "rememberedAuth",
  EXTENDED_SESSION: "extendedSession"
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
