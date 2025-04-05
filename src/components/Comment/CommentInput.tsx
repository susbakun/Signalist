import { postComment } from "@/features/Post/postsSlice"
import { CommentModel, PostModel } from "@/shared/models"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"

export type CommentInputProps = {
  commentPublisher: PostModel["publisher"]
  postId: PostModel["id"]
}

export const CommentInput = ({ commentPublisher, postId }: CommentInputProps) => {
  const [commentBody, setCommentBody] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()
  const handleCommentInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handlePostComment()
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [commentBody])

  const handlePostComment = () => {
    if (commentBody.trim() === "") return

    setCommentBody("")
    const publisher: CommentModel["publisher"] = {
      name: commentPublisher.name,
      imageUrl: commentPublisher.imageUrl,
      username: commentPublisher.username
    }
    dispatch(postComment({ body: commentBody, publisher, postId }))
  }
  return (
    <div
      className="dark:bg-gray-600 sticky bottom-0
      w-full mt-auto flex justify-center border-t
    border-t-white/30 px-3 py-2 items-center
      bg-gray-200"
    >
      <textarea
        ref={textareaRef}
        value={commentBody}
        onChange={handleCommentInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        className="resize-none border-none outline-none
      dark:bg-gray-600 w-[75%] md:w-[80%] min-h-[36px] max-h-[100px] 
      bg-gray-200 text-sm md:text-base px-1 py-1 rounded-md"
      ></textarea>
      <button
        onClick={handlePostComment}
        className="action-button w-[25%] md:w-[20%]
        dark:text-dark-link-button h-fit px-2 py-2 md:py-2
        text-primary-link-button font-bold text-sm md:text-base
        flex justify-center items-center rounded-md
        shadow-sm hover:shadow-md transition-all duration-200
        mobile:py-3 mobile:rounded-full mobile:mx-1 border border-white/40
        md:border-none"
      >
        Post
      </button>
    </div>
  )
}
