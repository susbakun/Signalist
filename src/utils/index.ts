import { SignalModel } from "@/shared/models"
import clsx, { ClassValue } from "clsx"
import moment from "jalali-moment"
import { twMerge } from "tailwind-merge"

export const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Tehran"
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
