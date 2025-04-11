import { ToastContainer } from "@/components"
import { dislikeCommentAsync, likeCommentAsync } from "@/features/Post/postsSlice"
import { CommentModel } from "@/shared/models"
import { SimplifiedAccountType } from "@/shared/types"
import { getCurrentUsername } from "@/utils"
import millify from "millify"
import { useState } from "react"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/store"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useCurrentUser } from "@/hooks/useCurrentUser"

type CommentFooterProps = {
  likes: CommentModel["likes"]
  commentId: CommentModel["commentId"]
  postId: CommentModel["postId"]
}

export const CommentFooter = ({ likes, commentId, postId }: CommentFooterProps) => {
  const currentUsername = getCurrentUsername()
  const [isLiked, setIsLiked] = useState(() => {
    return likes.some((user) => user.username === currentUsername)
  })
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const { handleShowToast, showToast, toastContent, toastType } = useToastContainer()

  const { currentUser: myAccount } = useCurrentUser()

  const handleLikeComment = async () => {
    if (!myAccount || isLoading) return

    const user: SimplifiedAccountType = {
      name: myAccount.name,
      username: myAccount.username,
      imageUrl: myAccount.imageUrl
    }

    try {
      setIsLoading(true)
      if (!isLiked) {
        await dispatch(likeCommentAsync({ commentId, postId, user }))
      } else {
        await dispatch(dislikeCommentAsync({ commentId, postId, user }))
      }
      setIsLiked((prev) => !prev)
    } catch (error) {
      console.error("Failed to update comment like:", error)
      handleShowToast("Failed to update comment like", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1 md:-translate-x">
        <button onClick={handleLikeComment} className="action-button" disabled={isLoading}>
          {isLiked ? (
            <HiBolt className="w-5 h-5 md:w-6 md:h-6 text-yellow-300" />
          ) : (
            <HiOutlineLightningBolt className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>
        <span className="text-xs md:text-sm">{millify(likes.length)}</span>
      </div>
      {showToast && (
        <ToastContainer toastType={toastType} showToast={showToast} toastContent={toastContent} />
      )}
    </>
  )
}
