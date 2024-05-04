import { dislikePost, likePost } from '@/features/Post/postsSlice'
import { PostModel } from '@/shared/models'
import millify from 'millify'
import { useState } from 'react'
import { FaBookmark, FaRegBookmark, FaRegComment } from 'react-icons/fa'
import { HiOutlineLightningBolt } from 'react-icons/hi'
import { HiBolt } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'

type PostFooterProps = {
  likes: PostModel['likes']
  comments: PostModel['comments']
  postId: PostModel['id']
}

export const PostFooter = ({ postId, likes, comments }: PostFooterProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const dispatch = useDispatch()

  const handleLikePost = () => {
    if (isLiked) {
      dispatch(likePost({ id: postId }))
    } else {
      dispatch(dislikePost({ id: postId }))
    }
    setIsLiked((prev) => !prev)
  }
  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev)
  }
  return (
    <div className="flex justify-between items-center mt-2">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-1">
          <button onClick={handleLikePost} className="action-button">
            {isLiked ? (
              <HiBolt className="w-6 h-6 text-yellow-300" />
            ) : (
              <HiOutlineLightningBolt className="w-6 h-6" />
            )}
          </button>
          <span className="detail-text">{millify(likes)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="action-button">
            <FaRegComment className="w-5 h-5" />
          </button>
          <span className="detail-text">{millify(comments.length)}</span>
        </div>
        <button className="action-button">repost</button>
        <button className="action-button">Share</button>
      </div>
      <button onClick={handleBookmark} className="action-button">
        {isBookmarked ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
      </button>
    </div>
  )
}
