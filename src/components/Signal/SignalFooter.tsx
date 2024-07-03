import { SharePostModal } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { dislikeSignal, likeSignal } from "@/features/Signal/signalsSlice"
import { AccountModel, SignalModel } from "@/shared/models"
import { isDarkMode } from "@/utils"
import millify from "millify"
import { useState } from "react"
import { FaBookmark, FaRegBookmark } from "react-icons/fa"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

type SignalFooterProps = {
  signalId: SignalModel["id"]
  likes: SignalModel["likes"]
  username: AccountModel["username"]
}

export const SignalFooter = ({ signalId, username, likes }: SignalFooterProps) => {
  const dispatch = useDispatch()

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const handleLikeSignal = () => {
    if (isLiked) {
      dispatch(dislikeSignal({ signalId, user: myAccount }))
    } else {
      dispatch(likeSignal({ signalId, user: myAccount }))
    }
    setIsLiked((prev) => !prev)
  }

  const handleBookmark = () => {
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
    const body = `See this post by @${username}:https://www.signalists/explore/${signalId}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/explore/${signalId}`
    await navigator.clipboard.writeText(link)
    toast.info("Post link is copied", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? "dark" : "light"
    })
    handleCloseShareModal()
  }

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
            <span className="detail-text">{millify(likes.length)}</span>
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
    </>
  )
}
