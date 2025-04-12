import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { AccountModel } from "@/shared/models"
import { getAvatarPlaceholder, isMobile } from "@/utils"
import { StreamingUserAvatar } from "./StreamingUserAvatar"
import { ComponentProps, useEffect, useState } from "react"
import { TbExternalLink } from "react-icons/tb"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"

type StreamingUserProps = Pick<AccountModel, "name" | "username" | "imageUrl"> & {
  myAccount: AccountModel
} & ComponentProps<"div">

export const StreamingUser = ({
  name,
  username,
  imageUrl,
  className,
  myAccount
}: StreamingUserProps) => {
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const placeholder = getAvatarPlaceholder(name)

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
          {isMobile() ? (
            <StreamingUserAvatar placeholderInitials={placeholder} imageUrl={imageUrl} size="lg" />
          ) : (
            <StreamingUserAvatar placeholderInitials={placeholder} imageUrl={imageUrl} size="md" />
          )}
          <Link to={`/${username}`} className="flex-col justify-center hidden md:flex">
            <p>{name.toLowerCase()}</p>
            <div className="flex gap-2">
              <p className="text-sm text-gray-600/70 dark:text-white/50">@{username}</p>
            </div>
          </Link>
        </div>
        <button className="action-button hidden md:block">
          <TbExternalLink className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
