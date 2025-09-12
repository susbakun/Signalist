import { AppDispatch } from "@/app/store"
import { SharePostModal, ToastContainer } from "@/components"
import { dislikeSignalAsync, likeSignalAsync } from "@/features/Signal/signalsSlice"
import { updateBookmarksAsync } from "@/features/User/usersSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { AccountModel, SignalModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import millify from "millify"
import { useEffect, useState } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"

type SignalFooterProps = {
  signal: SignalModel
  username: AccountModel["username"]
}

export const SignalFooter = ({ signal, username }: SignalFooterProps) => {
  const currentUsername = getCurrentUsername()
  const { currentUser: myAccount } = useCurrentUser()
  const isLiked = signal.likes.some((user) => user.username === currentUsername)

  const [isBookmarked, setIsBookmarked] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  const handleLikeSignal = async () => {
    if (!myAccount || isLikeLoading) return
    setIsLikeLoading(true)

    const user: SimplifiedAccountType = {
      name: myAccount.name,
      username: myAccount.username,
      imageUrl: myAccount.imageUrl
    }

    try {
      if (!isLiked) {
        await dispatch(likeSignalAsync({ signalId: signal.id, user }))
      } else {
        await dispatch(dislikeSignalAsync({ signalId: signal.id, user }))
      }
    } catch (error) {
      console.error("Failed to update like status:", error)
      handleShowToast("Failed to update like status", "error")
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!myAccount || isBookmarkLoading) return

    // Optimistically update UI
    setIsBookmarkLoading(true)
    const wasBookmarked = isBookmarked
    setIsBookmarked(!wasBookmarked)

    try {
      const updatedBookmarks = { ...myAccount.bookmarks }

      if (!wasBookmarked) {
        // Add signal ID to bookmarks
        updatedBookmarks.signals = [...updatedBookmarks.signals, signal.id]
      } else {
        // Remove signal ID from bookmarks
        updatedBookmarks.signals = updatedBookmarks.signals.filter((id) => id !== signal.id)
      }

      await dispatch(
        updateBookmarksAsync({
          username: myAccount.username,
          bookmarks: updatedBookmarks
        })
      ).unwrap()
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(wasBookmarked)
      console.error("Failed to update bookmark status:", error)
      handleShowToast("Failed to bookmark signal", "error")
    } finally {
      setIsBookmarkLoading(false)
    }
  }

  const handleCloseShareModal = () => {
    setOpenShareModal(false)
  }

  const handleOpenShareModal = () => {
    setOpenShareModal(true)
  }

  const handleShareEmail = () => {
    const title = `See this post by @${username}`
    const body = `See this post by @${username}:https://www.signalists/explore/${signal.id}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/explore/${signal.id}`
    await navigator.clipboard.writeText(link)
    handleShowToast("Signal link is copied", "copy_link")
    handleCloseShareModal()
  }

  useEffect(() => {
    if (myAccount && myAccount.bookmarks) {
      const isSignalBookmarked = myAccount.bookmarks.signals.includes(signal.id)
      setIsBookmarked(isSignalBookmarked)
    }
  }, [myAccount, signal.id])

  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-3 md:gap-4 items-center">
          <div className="flex items-center gap-[2px]">
            <button
              onClick={handleLikeSignal}
              className="action-button disabled:opacity-20"
              disabled={isLikeLoading}
            >
              {isLiked ? (
                <HiBolt className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
              ) : (
                <HiOutlineLightningBolt className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </button>
            <span className="text-xs md:text-sm detail-text">
              {millify(signal.likes?.length || 0)}
            </span>
          </div>
          <button onClick={handleOpenShareModal} className="action-button text-sm md:text-base">
            Share
          </button>
        </div>
        <button onClick={handleBookmark} className="action-button" disabled={isBookmarkLoading}>
          {isBookmarked ? (
            <FaBookmark className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FaRegBookmark className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
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
