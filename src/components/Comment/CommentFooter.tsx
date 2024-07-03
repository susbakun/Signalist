import { useAppSelector } from "@/features/Message/messagesSlice"
import { dislikeComment, likeComment } from "@/features/Post/postsSlice"
import { CommentModel } from "@/shared/models"
import millify from "millify"
import { useState } from "react"
import { HiOutlineLightningBolt } from "react-icons/hi"
import { HiBolt } from "react-icons/hi2"
import { useDispatch } from "react-redux"

type CommentFooterProps = {
  likes: CommentModel["likes"]
  commentId: CommentModel["commentId"]
  postId: CommentModel["postId"]
}

export const CommentFooter = ({ likes, commentId, postId }: CommentFooterProps) => {
  const [isLiked, setIsLiked] = useState(() => {
    return likes.some((user) => user.username === "Amir_Aryan")
  })
  const dispatch = useDispatch()

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const handleLikeComment = () => {
    if (!isLiked) {
      dispatch(likeComment({ commentId, postId, user: myAccount }))
    } else {
      dispatch(dislikeComment({ commentId, postId, user: myAccount }))
    }
    setIsLiked((prev) => !prev)
  }

  return (
    <div className="flex items-center gap-1 -translate-x">
      <button onClick={handleLikeComment} className="action-button">
        {isLiked ? (
          <HiBolt className="w-6 h-6 text-yellow-300" />
        ) : (
          <HiOutlineLightningBolt className="w-6 h-6" />
        )}
      </button>
      <span className="detail-text">{millify(likes.length)}</span>
    </div>
  )
}
