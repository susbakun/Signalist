import { MoreOptionsButton } from "@/components"
import { deleteComment } from "@/features/Post/postsSlice"
import { CommentModel, PostModel } from "@/shared/models"
import { formatDateFromMS, getAvatarPlaceholder } from "@/utils"
import { Avatar } from "flowbite-react"
import moment from "jalali-moment"
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

  const dispatch = useDispatch()

  const handleDeleteComment = () => {
    dispatch(deleteComment({ commentId, postId }))
  }

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <Avatar placeholderInitials={placeholder} size="md" img={user.imageUrl} rounded />
        <Link to={`/${user.username}`} className="flex flex-col justify-center">
          <p>{user.name.toLowerCase()}</p>
          <div className="flex gap-2">
            <p className="text-sm text-gray-600/70 dark:text-white/50">@{user.username}</p>
            <p className="detail-text">{moment(postDate).startOf("m").fromNow()}</p>
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
