import { AppDispatch } from "@/app/store"
import { CustomAvatar, ToastContainer, UserUnfollowModal } from "@/components"
import { followUserAsync, unfollowUserAsync } from "@/features/User/usersSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel } from "@/shared/models"
import { cn, getAvatarPlaceholder } from "@/utils"
import { ComponentProps, useMemo, useState } from "react"
import { TbMessage } from "react-icons/tb"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { twMerge } from "tailwind-merge"

type UserPreviewProps = Pick<AccountModel, "name" | "username" | "imageUrl"> &
  ComponentProps<"div"> & {
    follower?: AccountModel
    isForMessageRoom?: boolean
    handleCreateMessage?: () => void
    handleCheckboxChange?: () => void
    isForMessageGroup?: boolean
    selected?: boolean
  }

export const UserPreview = ({
  name,
  username: userUsername,
  imageUrl,
  follower,
  className,
  isForMessageRoom,
  isForMessageGroup,
  selected,
  handleCreateMessage,
  handleCheckboxChange
}: UserPreviewProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [localIsFollowed, setLocalIsFollowed] = useState(false)

  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  const isFollowed = useMemo(
    () => follower?.followings.some((following) => following.username === userUsername),
    [userUsername, follower]
  )

  // Update local state when the actual data changes
  useMemo(() => {
    setLocalIsFollowed(isFollowed || false)
  }, [isFollowed])

  const placeholder = getAvatarPlaceholder(name)

  const dispatch = useDispatch<AppDispatch>()

  const handleUserFollow = async () => {
    if (!follower || isActionLoading) return

    // Optimistically update UI state
    const wasFollowed = localIsFollowed
    if (!wasFollowed) {
      // Optimistically update UI
      setLocalIsFollowed(true)
      setIsActionLoading(true)
      try {
        await dispatch(
          followUserAsync({
            followerUsername: follower.username,
            followingUsername: userUsername
          })
        ).unwrap()
        handleShowToast(`You followed user @${userUsername}`, "follow")
      } catch (error) {
        // Revert optimistic update on error
        setLocalIsFollowed(false)
        handleShowToast("Failed to follow user", "error")
      } finally {
        setIsActionLoading(false)
      }
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = async () => {
    if (!follower || isActionLoading) return

    // Optimistically update UI
    setLocalIsFollowed(false)
    setIsActionLoading(true)
    setOpenUnfollowModal(false)

    try {
      await dispatch(
        unfollowUserAsync({
          followerUsername: follower.username,
          followingUsername: userUsername
        })
      ).unwrap()
      handleShowToast(`You unfollowed user @${userUsername}`, "unfollow")
    } catch (error) {
      // Revert optimistic update on error
      setLocalIsFollowed(true)
      handleShowToast("Failed to unfollow user", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCloseModal = () => {
    setOpenUnfollowModal(false)
  }

  return (
    <>
      <div className={twMerge("flex jusfity-between", className)}>
        <div className="flex gap-2 items-center flex-1">
          <CustomAvatar placeholderInitials={placeholder} size="md" img={imageUrl} rounded />
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
            disabled={isActionLoading}
            className={cn("action-button", {
              "dark:text-dark-link-button": localIsFollowed,
              "text-primary-link-button": localIsFollowed,
              "opacity-50 cursor-not-allowed": isActionLoading
            })}
          >
            {isActionLoading ? "Loading..." : localIsFollowed ? "followed" : "follow"}
          </button>
        )}
        {isForMessageRoom && (
          <button
            onClick={handleCreateMessage}
            className={cn("action-button", {
              "dark:text-dark-link-button": localIsFollowed,
              "text-primary-link-button": localIsFollowed
            })}
          >
            <TbMessage className="w-6 h-6" />
          </button>
        )}
        {isForMessageGroup && (
          <div className="flex items-center bg-transparent">
            <input
              type="checkbox"
              checked={selected}
              onChange={handleCheckboxChange}
              className="dark:bg-gray-700 bg-gray-100 outline-none
              rounded-full text-primary-link-button focus:outline-none
              dark:text-dark-link-button dark:focus:ring-0 h-6 w-6
              dark:focus:border-0 focus:ring-transparent"
            />
          </div>
        )}
      </div>
      <UserUnfollowModal
        username={userUsername}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseModal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
      <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
    </>
  )
}
