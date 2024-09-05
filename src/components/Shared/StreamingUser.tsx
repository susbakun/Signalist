import { useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { AccountModel } from "@/shared/models"
import { cn, getAvatarPlaceholder, isDarkMode } from "@/utils"
import { Avatar } from "flowbite-react"
import { ComponentProps, useEffect, useState } from "react"
import { TbExternalLink } from "react-icons/tb"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"

type StreamingUserProps = Pick<AccountModel, "name" | "username" | "imageUrl"> &
  ComponentProps<"div">

export const StreamingUser = ({ name, username, imageUrl, className }: StreamingUserProps) => {
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const placeholder = getAvatarPlaceholder(name)
  const users = useAppSelector((state) => state.users)
  const myAccount = users.find((user) => user.username === "Amir_Aryan")

  const { isUserBlocked: determineIsUserBlocked } = useIsUserBlocked(myAccount)

  useEffect(() => {
    if (myAccount) {
      setIsUserBlocked(determineIsUserBlocked(username))
    }
  }, [myAccount])

  if (isUserBlocked) return

  return (
    <>
      <div className={twMerge("flex jusfity-between", className)}>
        <div className="flex gap-2 items-center flex-1">
          <Avatar
            className={cn("gradient-border p-[1px] rounded-full", { dark: isDarkMode() })}
            placeholderInitials={placeholder}
            size="md"
            img={imageUrl}
            rounded
          />
          <Link to={`/${username}`} className="flex flex-col justify-center">
            <p>{name.toLowerCase()}</p>
            <div className="flex gap-2">
              <p className="text-sm text-gray-600/70 dark:text-white/50">@{username}</p>
            </div>
          </Link>
        </div>
        <button className="action-button">
          <TbExternalLink className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
