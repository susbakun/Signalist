import { isDevmode } from "@/utils"

export const demoImageUrl =
  "https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg"
export const messagesRouteRegExp = /\/messages\/?/
export const editPostRouteRegExp = /\/(explore\/)?(suggests|posts)\/editPost\/.*/
export const tradingviewSupportHost = "https://www.tradingview.com"
export const nobitexMarketChart = "https://nobitex.ir/nobitex-cdn/charts/"
export const cryptoPanicApiKey = import.meta.env.VITE_CRYPTOPANIC_API_KEY
export const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
export const backendUrl = isDevmode()
  ? "http://localhost:3000/api"
  : "https://signalist-backend.liara.run/api"
export const socketUrl = isDevmode()
  ? "http://localhost:3000"
  : "https://signalist-backend.liara.run"

// Storage Keys
export const STORAGE_KEYS = {
  WATCHLIST: "user_watchlist",
  LAST_ACTIVITY: "lastActivityTime",
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

// CoinDesk API Source IDs
export const cryptoNewsSourceIds = [
  { value: "coindesk", label: "CoinDesk" },
  { value: "cointelegraph", label: "CoinTelegraph" },
  { value: "decrypt", label: "Decrypt" },
  { value: "bitcoinmagazine", label: "Bitcoin Magazine" },
  { value: "coingape", label: "CoinGape" }
]

export const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-36 h-36 text-xl"
}
