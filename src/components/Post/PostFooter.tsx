import { PostCommentModal, SharePostModal, ToastContainer } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { dislikePost, likePost } from "@/features/Post/postsSlice"
import { useToastContainer } from "@/hooks/useToastContainer"
import { PostModel } from "@/shared/models"
import { cn } from "@/utils"
import millify from "millify"
import { useState } from "react"
import { FaBookmark, FaCommentSlash, FaRegBookmark, FaRegComment } from "react-icons/fa"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"

type PostFooterProps = {
  post: Omit<PostModel, "comments">
  comments?: PostModel["comments"]
  simplified?: boolean
  amISubscribed?: boolean
  handleOpenEditPostModal?: () => void
}

export const PostFooter = ({
  post,
  comments,
  simplified,
  amISubscribed,
  handleOpenEditPostModal
}: PostFooterProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(() => {
    return post.likes.some((user) => user.username === "Amir_Aryan")
  })

  const [openShareModal, setOpenShareModal] = useState(false)
  const [openCommentsModal, setOpenCommentsModal] = useState(false)

  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()
  const dispatch = useDispatch()

  const { publisher } = post

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const handleLikePost = () => {
    if (!isLiked) {
      dispatch(likePost({ postId: post.id, user: myAccount }))
    } else {
      dispatch(dislikePost({ postId: post.id, user: myAccount }))
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

  const handleOpenCommentsModal = () => {
    setOpenCommentsModal(true)
  }

  const handleCloseCommentsModal = () => {
    setOpenCommentsModal(false)
  }

  const handleShareEmail = () => {
    const title = `See this post by @${publisher.username}`
    const body = `See this post by @${publisher.username}:https://www.signalists/explore/${post.id}`
    const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    handleCloseShareModal()
    window.open(shareUrl)
  }

  const handleCopyLink = async () => {
    const link = `https://www.signalists/explore/${post.id}`
    await navigator.clipboard.writeText(link)
    handleShowToast("Post link is copied", "copy_link")
    handleCloseShareModal()
  }

  return (
    <>
      <div
        className={cn("flex justify-between items-center mt-2", { "-translate-x-2": simplified })}
      >
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-[2px]">
            <button onClick={handleLikePost} className="action-button">
              {isLiked ? (
                <HiBolt className="w-6 h-6 text-yellow-300" />
              ) : (
                <HiOutlineLightningBolt className="w-6 h-6" />
              )}
            </button>
            <span className="detail-text">{millify(post.likes.length)}</span>
          </div>
          {comments && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenCommentsModal}
                className="action-button"
                disabled={!amISubscribed && post.isPremium}
              >
                {post.isPremium && !amISubscribed ? (
                  <FaCommentSlash className="w-5 h-5" />
                ) : (
                  <FaRegComment className="w-5 h-5" />
                )}
              </button>
              <span className="detail-text">{millify(comments.length)}</span>
            </div>
          )}
          {!simplified && (
            <>
              <button className="action-button">repost</button>
              <button onClick={handleOpenShareModal} className="action-button">
                Share
              </button>
            </>
          )}
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
      {comments && (
        <PostCommentModal
          handleOpenEditPostModal={handleOpenEditPostModal}
          post={post}
          comments={comments}
          handleCloseCommentsModal={handleCloseCommentsModal}
          openModal={openCommentsModal}
        />
      )}
      <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
    </>
  )
}
