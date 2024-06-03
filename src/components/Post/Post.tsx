import { PostBody, PostFooter, PostTopBar } from '@/components'
import { useIsUserSubscribed } from '@/hooks/useIsUserSubscribed'
import { PostModel } from '@/shared/models'

type PostProps = {
  post: PostModel
}

export const Post = ({ post }: PostProps) => {
  const { publisher } = post

  const { amISubscribed } = useIsUserSubscribed(publisher)

  return (
    <div
      className="border-y border-y-gray-600/20 dark:border-y-white/20 px-4 py-6 flex
      flex-col gap-4"
    >
      <PostTopBar
        subscribed={amISubscribed}
        postContent={post.content}
        postId={post.id}
        {...publisher}
        date={post.date}
      />

      <PostBody
        isPremium={post.isPremium}
        publisherUsername={publisher.username}
        amISubscribed={amISubscribed}
        content={post.content}
      />
      <PostFooter amISubscribed={amISubscribed} post={post} comments={post.comments} />
    </div>
  )
}
