import { CommentModel } from '@/shared/models'

export const CommentBody = ({ body }: { body: CommentModel['body'] }) => {
  return (
    <div className="translate-x-1">
      <p>{body}</p>
    </div>
  )
}
