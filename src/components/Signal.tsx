import { dislikeSignal, likeSignal } from '@/features/Signal/signalsSlice'
import { SignalModel } from '@/shared/models'
import { isDarkMode } from '@/utils'
import millify from 'millify'
import { useState } from 'react'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { HiBolt } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { SharePostModal } from './Modal/SharePostModal'
import { SignalContext } from './SignalContext'
import { SignalTopBar } from './SignalTopBar'

type SignalProps = {
  signal: SignalModel
}

export const Signal = ({ signal }: SignalProps) => {
  const dispatch = useDispatch()
  const { publisher } = signal

  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)

  const handleLikeSignal = () => {
    if (isLiked) {
      dispatch(dislikeSignal({ id: signal.id }))
    } else {
      dispatch(likeSignal({ id: signal.id }))
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
    const title = `See this post by @${publisher.username}`
    const body = `See this post by @${publisher.username}:https://www.signalists/explore/${signal.id}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/explore/${signal.id}`
    await navigator.clipboard.writeText(link)
    toast.info('Post link is copied', {
      position: 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: isDarkMode() ? 'dark' : 'light'
    })
    handleCloseShareModal()
  }

  return (
    <div
      className="flex flex-col gap-8 px-4 py-6 border-b
    border-b-gray-600/20 dark:border-b-white/20"
    >
      <SignalTopBar publisher={publisher} date={signal.date} signalId={signal.id} />
      <SignalContext signal={signal} />
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
              <span className="detail-text">{millify(signal.likes)}</span>
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
    </div>
  )
}
