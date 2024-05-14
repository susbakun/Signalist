import { PostBody, PostFooter, PostTopBar } from '@/components'
import { PostModel } from '@/shared/models'

type PostProps = {
  post: PostModel
}

export const Post = ({ post }: PostProps) => {
  return (
    <div
      className="border-y border-y-gray-600/20 dark:border-y-white/20 px-4 py-6 flex
      flex-col gap-4"
    >
      <PostTopBar content={post.content} postId={post.id} {...post.publisher} date={post.date} />
      <PostBody content={post.content} />
      <PostFooter post={post} comments={post.comments} />
    </div>
  )
}
