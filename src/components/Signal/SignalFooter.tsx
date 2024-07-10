import { SharePostModal, ToastContainer } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { dislikeSignal, likeSignal } from "@/features/Signal/signalsSlice"
import { bookmarkSignal, unBookmarkSignal } from "@/features/User/usersSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { AccountModel, SignalModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
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
  const [isLiked, setIsLiked] = useState(() => {
    return signal.likes.some((user) => user.username === "Amir_Aryan")
  })
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)

  const dispatch = useDispatch()
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  const handleLikeSignal = () => {
    if (!myAccount) return

    const user: SimplifiedAccountType = {
      name: myAccount.name,
      username: myAccount.username,
      imageUrl: myAccount.imageUrl
    }

    if (isLiked) {
      dispatch(dislikeSignal({ signalId: signal.id, user }))
    } else {
      dispatch(likeSignal({ signalId: signal.id, user }))
    }
    setIsLiked((prev) => !prev)
  }

  const handleBookmark = () => {
    if (!isBookmarked) {
      dispatch(bookmarkSignal({ userUsername: myAccount?.username, signal }))
    } else {
      dispatch(unBookmarkSignal({ signalId: signal.id, userUsername: myAccount?.username }))
    }
    setIsBookmarked((prev) => !prev)
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
    if (myAccount) {
      const isSignalBookmarked = myAccount.bookmarks.signals.some(
        (bookmarkedSignal) => bookmarkedSignal.id === signal.id
      )
      setIsBookmarked(isSignalBookmarked)
    }
  }, [myAccount])

  return (
    <>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-[2px]">
            <button onClick={handleLikeSignal} className="action-button">
              {isLiked ? (
                <HiBolt className="w-6 h-6 text-yellow-300" />
              ) : (
                <HiOutlineLightningBolt className="w-6 h-6" />
              )}
            </button>
            <span className="detail-text">{millify(signal.likes.length)}</span>
          </div>
          <button onClick={handleOpenShareModal} className="action-button">
            Share
          </button>
        </div>
        <button onClick={handleBookmark} className="action-button">
          {isBookmarked ? (
            <FaBookmark className="w-5 h-5" />
          ) : (
            <FaRegBookmark className="w-5 h-5" />
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
