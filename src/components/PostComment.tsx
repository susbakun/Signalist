import { PostModel } from '@/shared/models'
import { CommentBody } from './CommentBody'
import { CommentFooter } from './CommentFooter'
import { CommentTopBar } from './CommentTopBar'

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
