export const demoImageUrl =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
export const messagesRouteRegExp = /\/messages\/?/
export const editPostRouteRegExp = /\/(explore\/)?(suggests|posts)\/editPost\/.*/
export const tradingviewSupportHost = "https://www.tradingview.com"
export const nobitexMarketChart = "https://nobitex.ir/nobitex-cdn/charts/"
export const cryptoPanicApiKey = import.meta.env.VITE_CRYPTOPANIC_API_KEY
export const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
export const backendUrl = "https://signalist-backend.liara.run/api"
export const socketUrl = "https://signalist-backend.liara.run"

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
  { value: "BTC", label: "Bitcoin" },
  { value: "ETH", label: "Ethereum" },
  { value: "XRP", label: "Ripple" },
  { value: "LTC", label: "Litecoin" },
  { value: "ADA", label: "Cardano" },
  { value: "DOT", label: "Polkadot" },
  { value: "BNB", label: "Binance Coin" },
  { value: "SOL", label: "Solana" },
  { value: "DOGE", label: "Dogecoin" },
  { value: "SHIB", label: "Shiba Inu" }
]

export const cryptoNewsFilters = [
  { value: "rising", label: "Rising" },
  { value: "hot", label: "Hot" },
  { value: "bullish", label: "Bullish" },
  { value: "bearish", label: "Bearish" }
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

export const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-36 h-36 text-xl"
}
