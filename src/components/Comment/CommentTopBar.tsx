import { AppDispatch } from "@/app/store"
import { CustomAvatar, MoreOptionsButton } from "@/components"
import { deleteCommentAsync } from "@/features/Post/postsSlice"
import { CommentModel, PostModel } from "@/shared/models"
import { formatDateFromMS, getAvatarPlaceholder } from "@/utils"
import moment from "jalali-moment"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

type CommentTopBarProps = {
  user: CommentModel["publisher"]
  date: CommentModel["date"]
  commentId: CommentModel["commentId"]
  postId: PostModel["id"]
}

export const CommentTopBar = ({ user, date, commentId, postId }: CommentTopBarProps) => {
  const placeholder = getAvatarPlaceholder(user.name)
  const postDate = formatDateFromMS(date)

  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteComment = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await dispatch(deleteCommentAsync({ commentId, postId }))
    } catch (error) {
      console.error("Failed to update comment like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-1 md:gap-2 items-center">
        <CustomAvatar
          placeholderInitials={placeholder}
          size="sm"
          wrapperClassName="h-10 w-10"
          img={user.imageUrl}
          rounded
        />
        <Link to={`/${user.username}`} className="flex flex-col justify-center">
          <p className="text-sm md:text-base">{user.name.toLowerCase()}</p>
          <div className="flex gap-1 md:gap-2">
            <p className="text-xs md:text-sm text-gray-600/70 dark:text-white/50">
              @{user.username}
            </p>
            <p className="text-xs md:text-sm detail-text">
              {moment(postDate).startOf("m").fromNow()}
            </p>
          </div>
        </Link>
      </div>
      <MoreOptionsButton
        isForComment
        username={user.username}
        handleDeleteComment={handleDeleteComment}
      />
    </div>
  )
}
