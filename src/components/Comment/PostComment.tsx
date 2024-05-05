import { CommentBody, CommentFooter, CommentTopBar } from '@/components'
import { PostModel } from '@/shared/models'

type PostCommentProps = PostModel['comments'][0]

export const PostComment = ({
  body,
  date,
  publisher,
  likes,
  commentId,
  postId
}: PostCommentProps) => {
  return (
    <>
      <CommentTopBar user={publisher} date={date} />
      <CommentBody body={body} />
      <CommentFooter likes={likes} commentId={commentId} postId={postId} />
    </>
  )
}
