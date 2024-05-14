import { postComment } from '@/features/Post/postsSlice'
import { CommentModel, PostModel } from '@/shared/models'
import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'

export type CommentInputProps = {
  commentPublisher: PostModel['publisher']
  postId: PostModel['id']
}

export const CommentInput = ({ commentPublisher, postId }: CommentInputProps) => {
  const dispatch = useDispatch()
  const [commentBody, setCommentBody] = useState('')
  const handleCommentInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handlePostComment()
    }
  }

  const handlePostComment = () => {
    setCommentBody('')
    const publisher: CommentModel['publisher'] = {
      name: commentPublisher.name,
      imageUrl: commentPublisher.imageUrl,
      username: commentPublisher.username
    }
    console.log(publisher)
    dispatch(postComment({ body: commentBody, publisher, postId }))
  }
  return (
    <div
      className="h-[50px] dark:bg-gray-600 sticky bottom-0
      w-full mt-auto flex justify-center border-t
    border-t-white/30 px-2 pb-0 items-start
      bg-gray-200"
    >
      <textarea
        value={commentBody}
        onChange={handleCommentInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        className="resize-none border-none outline-none
      dark:bg-gray-600 w-[80%] h-[49px] bg-gray-200"
      ></textarea>
      <button
        onClick={handlePostComment}
        className="action-button w-[20%]
        dark:text-dark-link-button h-fit pt-[9px]
        text-primary-link-button font-bold"
      >
        Post
      </button>
    </div>
  )
}
