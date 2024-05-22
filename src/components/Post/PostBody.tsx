import { PostModel } from '@/shared/models'

type PostBodyProps = {
  content: PostModel['content']
}

export const PostBody = ({ content }: PostBodyProps) => {
  return <div>{content}</div>
}
