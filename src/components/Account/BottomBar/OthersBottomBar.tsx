import { SharePostModal, ToastContainer, UserUnfollowModal } from "@/components"
import { ShaerUserButton } from "@/components/Button/ShaerUserButton"
import { AppDispatch } from "@/app/store"
import { createDMConversationAsync, useAppSelector } from "@/features/Message/messagesSlice"
import { followUserAsync, unfollowUserAsync } from "@/features/User/usersSlice"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { AccountModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { useMemo, useState } from "react"
import { BiMessage } from "react-icons/bi"
import { IoLockClosed, IoLockOpenOutline } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { SimplifiedAccountType } from "@/shared/types"
import { v4 } from "uuid"

type OthersBottomBarProps = {
  userAccount: AccountModel
  myAccount?: AccountModel
}

export const OthersBottomBar = ({ userAccount, myAccount }: OthersBottomBarProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)

  const currentUsername = getCurrentUsername()
  const messages = useAppSelector((state) =>
    currentUsername ? state.messages.conversations[currentUsername] : {}
  )

  const isFollowed = useMemo(
    () => myAccount?.followings.some((following) => following.username === userAccount.username),
    [myAccount, userAccount]
  )
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  const { checkIfExistsRoom, findExistingRoomId } = useUserMessageRoom()
  const { amISubscribed } = useIsUserSubscribed(userAccount)

  const handleCreateMessage = () => {
    if (!myAccount || !currentUsername) return

    handleCloseModal()
    if (messages && checkIfExistsRoom(messages, userAccount)) {
      const roomId = findExistingRoomId(messages, userAccount)
      navigate(`/messages/${roomId}`)
    } else {
      const userInfo: SimplifiedAccountType = {
        name: userAccount.name,
        username: userAccount.username,
        imageUrl: userAccount.imageUrl
      }
      const roomId = v4()
      dispatch(createDMConversationAsync({ user1: myAccount, user2: userInfo }))
      navigate(`/messages/${roomId}`)
    }
  }

  const handleFollowUser = async () => {
    if (!myAccount?.username || isActionLoading) return

    if (!isFollowed) {
      setIsActionLoading(true)
      try {
        await dispatch(
          followUserAsync({
            followerUsername: myAccount.username,
            followingUsername: userAccount.username
          })
        ).unwrap()
        handleShowToast(`You followed user @${userAccount.username}`, "follow")
      } catch (error) {
        handleShowToast("Failed to follow user", "error")
      } finally {
        setIsActionLoading(false)
      }
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = async () => {
    if (!myAccount?.username || isActionLoading) return

    setIsActionLoading(true)
    try {
      await dispatch(
        unfollowUserAsync({
          followerUsername: myAccount.username,
          followingUsername: userAccount.username
        })
      ).unwrap()
      handleShowToast(`You unfollowed user @${userAccount.username}`, "unfollow")
      setOpenUnfollowModal(false)
    } catch (error) {
      handleShowToast("Failed to unfollow user", "error")
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleCloseModal = () => {
    setOpenUnfollowModal(false)
  }

  const handleOpenShareModal = () => {
    setOpenShareModal(true)
  }

  const handleCloseShareModal = () => {
    setOpenShareModal(false)
  }

  const handleShareEmail = () => {
    const title = `See the user @${userAccount.username}`
    const body = `See the user @${userAccount.username}:https://www.signalists/${userAccount.username}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/${userAccount.username}`
    await navigator.clipboard.writeText(link)
    handleShowToast("Profile link is copied", "copy_link")
    handleCloseShareModal()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <button
              onClick={handleFollowUser}
              disabled={isActionLoading}
              className="px-3 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? "Loading..." : isFollowed ? "followed" : "follow"}
            </button>
          </div>
          <div>
            <button
              onClick={handleCreateMessage}
              className="px-4 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-white flex"
            >
              <BiMessage className="w-5 h-6" />
            </button>
          </div>
          {userAccount.hasPremium && (
            <div>
              <Link
                to="premium"
                className="px-2 py-1 bg-gradient-to-r
                    dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
                    dark:to-[#ff00e5] rounded-md action-button
                  text-white flex gap-1 items-center"
              >
                {amISubscribed ? "charge premium" : "premium"}
                {amISubscribed ? <IoLockOpenOutline /> : <IoLockClosed />}
              </Link>
            </div>
          )}
        </div>
        <ShaerUserButton handleOpenShareModal={handleOpenShareModal} />
      </div>
      <UserUnfollowModal
        username={userAccount.username}
        openModal={openUnfollowModal}
        handleCloseModal={handleCloseModal}
        handleAcceptUnfollowModal={handleAcceptUnfollowModal}
      />
      <SharePostModal
        openModal={openShareModal}
        handleCloseModal={handleCloseShareModal}
        copyLink={handleCopyLink}
        shareEmail={handleShareEmail}
      />
      <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
    </>
  )
}
