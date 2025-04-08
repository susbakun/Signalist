import { SharePostModal, ToastContainer, UserUnfollowModal } from "@/components"
import { ShaerUserButton } from "@/components/Button/ShaerUserButton"
import { createRoom, useAppSelector } from "@/features/Message/messagesSlice"
import { followUser, unfollowUser } from "@/features/User/usersSlice"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { AccountModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import { useMemo, useState } from "react"
import { BiMessage } from "react-icons/bi"
import { IoLockClosed, IoLockOpenOutline } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { v4 } from "uuid"

type OthersBottomBarProps = {
  userAccount: AccountModel
  myAccount?: AccountModel
}

export const OthersBottomBar = ({ userAccount, myAccount }: OthersBottomBarProps) => {
  const [openUnfollowModal, setOpenUnfollowModal] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)

  const currentUsername = getCurrentUsername()
  const messages = useAppSelector((state) => state.messages)[currentUsername || ""]

  const isFollowed = useMemo(
    () => myAccount?.followings.some((following) => following.username === userAccount.username),
    [myAccount, userAccount]
  )
  const dispatch = useDispatch()
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
      dispatch(createRoom({ myUsername: currentUsername, userInfo, roomId }))
      navigate(`/messages/${roomId}`)
    }
  }

  const handleFollowUser = () => {
    if (!isFollowed) {
      handleShowToast(`You followed user @${userAccount.username}`, "follow")
      dispatch(
        followUser({
          followerUsername: myAccount?.username,
          followingUsername: userAccount.username
        })
      )
    } else {
      setOpenUnfollowModal(true)
    }
  }

  const handleAcceptUnfollowModal = () => {
    handleShowToast(`You unfollowed user @${userAccount.username}`, "unfollow")
    dispatch(
      unfollowUser({
        followerUsername: myAccount?.username,
        followingUsername: userAccount.username
      })
    )
    setOpenUnfollowModal(false)
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
    const title = `See the user @${myAccount?.username}`
    const body = `See the user @${myAccount?.username}:https://www.signalists/${myAccount?.username}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/${myAccount?.username}`
    await navigator.clipboard.writeText(link)
    handleShowToast("Post link is copied", "copy_link")
    handleCloseShareModal()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <button
              onClick={handleFollowUser}
              className="px-3 py-1 bg-primary-link-button
                dark:bg-dark-link-button rounded-md action-button
                text-white"
            >
              {isFollowed ? "followed" : "follow"}
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
