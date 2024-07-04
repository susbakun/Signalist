import { UserUnfollowModal } from "@/components"
import { followUser, unfollowUser } from "@/features/User/usersSlice"
import { AccountModel } from "@/shared/models"
import { cn, getAvatarPlaceholder, isDarkMode } from "@/utils"
import { Avatar } from "flowbite-react"
import { ComponentProps, useMemo, useState } from "react"
import { TbMessage } from "react-icons/tb"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { twMerge } from "tailwind-merge"

type UserPreviewProps = Pick<AccountModel, "name" | "username" | "imageUrl"> &
  ComponentProps<"div"> & {
    follower?: AccountModel
    isForMessageRoom?: boolean
    handleCreateMessage?: () => void
  }

export const UserPreview = ({
  name,
  username: userUsername,
  imageUrl,
  follower,
  className,
  isForMessageRoom,
  handleCreateMessage
}: UserPreviewProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)

  const isFollowed = useMemo(
    () => follower?.followings.some((following) => following.username === userUsername),
    [userUsername, follower]
  )

  const placeholder = getAvatarPlaceholder(name)

  const dispatch = useDispatch()

  const handleUserFollow = () => {
    if (!isFollowed) {
      toast.success(`You followed user @${userUsername}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode() ? "dark" : "light"
      })
      dispatch(
        followUser({
          followeruserUsername: follower?.username,
          followinguserUsername: userUsername
        })
      )
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    toast.warn(`You unfollowed user @${userUsername}`, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? "dark" : "light"
    })
    dispatch(
      unfollowUser({
        followeruserUsername: follower?.username,
        followinguserUsername: userUsername
      })
    )
    setOpenUnfollowModal(false)
  }

  const handleCloseModal = () => {
    setOpenUnfollowModal(false)
  }

  return (
    <>
      <div className={twMerge("flex jusfity-between", className)}>
        <div className="flex gap-2 items-center flex-1">
          <Avatar placeholderInitials={placeholder} size="md" img={imageUrl} rounded />
          {isForMessageRoom ? (
            <div className="flex flex-col justify-center">
              <p>{name.toLowerCase()}</p>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600/70 dark:text-white/50">@{userUsername}</p>
              </div>
            </div>
          ) : (
            <Link to={`/${userUsername}`} className="flex flex-col justify-center">
              <p>{name.toLowerCase()}</p>
              <div className="flex gap-2">
                <p className="text-sm text-gray-600/70 dark:text-white/50">@{userUsername}</p>
              </div>
            </Link>
          )}
        </div>
        {follower && follower.username !== userUsername && (
          <button
            onClick={handleUserFollow}
            className={cn("action-button", {
              "dark:text-dark-link-button": isFollowed,
              "text-primary-link-button": isFollowed
            })}
          >
            {isFollowed ? "followed" : "follow"}
          </button>
        )}
        {isForMessageRoom && (
          <button
            onClick={handleCreateMessage}
            className={cn("action-button", {
              "dark:text-dark-link-button": isFollowed,
              "text-primary-link-button": isFollowed
            })}
          >
            <TbMessage className="w-6 h-6" />
          </button>
        )}
      </div>
      <UserUnfollowModal
        username={userUsername}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseModal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
    </>
  )
}
