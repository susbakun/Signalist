import { CommentBody, CommentFooter, CommentTopBar } from '@/components'
import { PostModel } from '@/shared/models'
import { cn } from '@/utils'

type PostCommentProps = PostModel['comments'][0] & {
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
  return (
    <div
      className={cn('border-b dark:border-b-white/20 pb-3 pl-4 pr-6 flex flex-col gap-2', {
        'border-none': isLastComment
      })}
    >
      <CommentTopBar user={publisher} date={date} />
      <CommentBody body={body} />
      <CommentFooter likes={likes} commentId={commentId} postId={postId} />
    </div>
  )
}
