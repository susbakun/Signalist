import { PostModel } from '@/shared/models'

export const PostBody = ({ content }: { content: PostModel['content'] }) => {
  return (
    <div>
      <p>{content}</p>
    </div>
  )
}
