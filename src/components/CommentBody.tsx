import { CommentModel } from '@/shared/models'

export const CommentBody = ({ body }: { body: CommentModel['body'] }) => {
  return (
    <div>
      <p>{body}</p>
    </div>
  )
}
