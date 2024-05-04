import { PostModel } from '@/shared/models'
import { PostBody } from './PostBody'
import { PostFooter } from './PostFooter'
import { PostTopBar } from './PostTopBar'

type PostProps = PostModel

export const Post = ({ id, date, likes, content, publisher, comments }: PostProps) => {
  return (
    <div
      className="border-y border-y-gray-600/20 dark:border-y-white/20 px-4 py-6 flex
     flex-col gap-4"
    >
      <PostTopBar postId={id} {...publisher} date={date} />
      <PostBody content={content} />
      <PostFooter username={publisher.username} postId={id} likes={likes} comments={comments} />
    </div>
  )
}
