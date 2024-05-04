import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Asia/Tehran'
})

export const formatDateFromMS = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

export const getAvatarPlaceholder = (name: string) => {
  const words = name.toUpperCase().split(' ')
  let avatarPlaceholder = ''
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
  return document.body.classList.contains('darkmode')
}
