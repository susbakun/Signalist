import { CommentModel } from "@/shared/models"

export const CommentBody = ({ body }: { body: CommentModel["body"] }) => {
  return (
    <div className="md:translate-x-1">
      <p className="text-sm md:text-base">{body}</p>
    </div>
  )
}
