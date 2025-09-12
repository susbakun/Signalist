import { CommentBody, CommentFooter, CommentTopBar } from "@/components"
import { PostModel } from "@/shared/models"
import { cn } from "@/utils"

type PostCommentProps = PostModel["comments"][0] & {
  isLastComment: boolean
}

export const PostComment = ({
  body,
  date,
  publisher,
  likes,
  commentId,
  postId,
  isLastComment
}: PostCommentProps) => {
  // Safety check for corrupted comment data
  if (!publisher || !body || !commentId || !postId) {
    console.error("PostComment: Invalid comment data received:", {
      body,
      date,
      publisher,
      likes,
      commentId,
      postId
    })
    return (
      <div className="flex items-center gap-2 p-2 text-red-500 text-sm border-b dark:border-b-white/20 pb-3 px-3 md:pl-4 md:pr-6">
        Error: Invalid comment data
      </div>
    )
  }

  return (
    <div
      className={cn(
        "border-b dark:border-b-white/20 pb-3 px-3 md:pl-4 md:pr-6 flex flex-col gap-2",
        {
          "border-none": isLastComment
        }
      )}
    >
      <CommentTopBar postId={postId} commentId={commentId} user={publisher} date={date} />
      <CommentBody body={body} />
      <CommentFooter likes={likes} commentId={commentId} postId={postId} />
    </div>
  )
}
