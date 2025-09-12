import { STORAGE_KEYS } from "@/shared/constants"
import { SignalModel, WallexCoinType, WallexCryptoResponseType } from "@/shared/models"
import clsx, { ClassValue } from "clsx"
import moment from "jalali-moment"
import { twMerge } from "tailwind-merge"

export const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

export const formatDateFromMS = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const getAvatarPlaceholder = (name: string) => {
  const words = name.toUpperCase().split(" ")
  let avatarPlaceholder = ""
  if (words.length > 1 && words[1] !== "") {
    for (const word of words) {
      avatarPlaceholder += word[0]
    }
  } else if (words.length === 1 && words[0].length > 1) {
    avatarPlaceholder += words[0][0] + words[0][1]
  } else {
    avatarPlaceholder += words[0][0]
  }
  return avatarPlaceholder
}

export const isDarkMode = () => {
  return document.body.classList.contains("darkmode")
}

export const getFormattedMarketName = (marketName: SignalModel["market"]["name"]) => {
  const slashSybmolIndex = marketName.indexOf("/")
  const formattedMarketName =
    marketName.slice(0, slashSybmolIndex) + marketName.slice(slashSybmolIndex + 1)
  return formattedMarketName
}

export const getMarketScale = (marketName: SignalModel["market"]["name"]) => {
  return marketName.split("/")[1]
}

export const formatMessageDate = (date: number) => {
  return moment(date).calendar(undefined, {
    sameDay: "[Today]",
    nextDay: "[Tomorrow]",
    nextWeek: "dddd",
    lastDay: "[Yesterday]",
    lastWeek: "[Last] dddd",
    sameElse: "MMM D, YYYY"
  })
}

export const isEmpty = (array: unknown[]) => {
  return array.length === 0
}

export const getFormattedSignalMarketName = (marketName: SignalModel["market"]["name"]) => {
  return marketName.split("/").join()
}

export const toggleThemeMode = (themeMode: string) => {
  document.documentElement.classList.remove("dark", "light", "os-default")
  document.body.classList.remove("darkmode", "lightmode", "os-defaultmode")

  switch (themeMode) {
    case "Dark":
      document.documentElement.classList.add("dark")
      document.body.classList.add("darkmode")
      break
    case "Light":
      document.documentElement.classList.add("light")
      document.body.classList.add("lightmode")
      break
    case "Os Default":
      applyOsDefaultTheme()
      break
    default:
      break
  }
}

export const applyOsDefaultTheme = () => {
  const userPrefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  const userPrefersLight =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
  if (userPrefersDark) {
    toggleThemeMode("Dark")
  } else if (userPrefersLight) {
    toggleThemeMode("Light")
  } else {
    toggleThemeMode("Os Default")
  }
}

export const isDevmode = () => {
  return import.meta.env.MODE === "development"
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  if (!userStr) return null
  const user = JSON.parse(userStr)

  return user
}

export const getCurrentUsername = () => {
  const user = getCurrentUser()
  return user.username || null
}

export const isMobile = () => {
  return window.matchMedia && window.matchMedia("(max-width: 639px)").matches
}

export const isXLScreen = () => {
  return window.matchMedia && window.matchMedia("(min-width: 1280px)").matches
}

// Function to transform Wallex API data into CoinType format
export const transformWallexData = (wallexData: WallexCryptoResponseType | undefined) => {
  if (!wallexData || !wallexData.result || !wallexData.result.markets) {
    return []
  }

  return wallexData.result.markets.map((coin: WallexCoinType) => {
    // Convert any numeric changes to strings for consistency with CoinType
    const changeValue = coin.change_24h.toString()

    return {
      uuid: coin.symbol, // Using symbol as the unique identifier
      symbol: coin.base_asset,
      name: coin.en_base_asset,
      iconUrl: `https://wallex.ir/_next/image?url=https%3A%2F%2Fapi.wallex.ir%2Fcoins%2F${coin.base_asset}.svg&w=32&q=75`,
      price: coin.price,
      change: changeValue,
      "24hVolume": coin.volume_24h?.toString() || "0",
      marketCap: "0", // Wallex doesn't provide market cap
      rank: 0, // Wallex doesn't provide rank
      quoteAsset: coin.quote_asset // New field to store the quote asset (USDT, TMN, etc.)
    }
  })
}

export const urlToFile = async (url: string, filename: string, mimeType: string) => {
  const res = await fetch(url)
  const blob = await res.blob()
  return new File([blob], filename, { type: mimeType })
}

export const getWeeklyChartUrl = (symbol: string) => {
  return `https://images.cryptocompare.com/sparkchart/${symbol}/USD/latest.png?ts=`
}

export const timeAgoFromNow = (dateMs: number) => {
  const diff = Date.now() - Number(dateMs)
  const sec = Math.floor(diff / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)
  if (day > 0) return `${day}d`
  if (hr > 0) return `${hr}h`
  if (min > 0) return `${min}m`
  return `${sec}s`
}
