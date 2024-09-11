import { MessageModel, SignalModel } from "@/shared/models"
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
  if (words.length > 1) {
    for (const word of words) {
      avatarPlaceholder += word[0]
    }
  } else {
    avatarPlaceholder += words[0][0] + words[0][1]
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

export const isGroupRoom = (messages: MessageModel["username"]["roomId"]) => {
  return messages.groupInfo && messages.usersInfo && messages.isGroup
}
