import { BluredPostComponent, PostBody, PostFooter, PostTopBar } from '@/components'
import { PostModel } from '@/shared/models'
import { Link } from 'react-router-dom'

type PostProps = {
  post: PostModel
}

export const Post = ({ post }: PostProps) => {
  const { publisher } = post
  return (
    <div
      className="border-y border-y-gray-600/20 dark:border-y-white/20 px-4 py-6 flex
      flex-col gap-4"
    >
      <PostTopBar postContent={post.content} postId={post.id} {...publisher} date={post.date} />
      {post.isPremium && publisher.username !== 'Amir_Aryan' && !post.subscribed ? (
        <div className="relative rounded-lg overflow-x-hidden">
          <BluredPostComponent />
          <Link
            to={`/${publisher.username}/premium`}
            className="absolute top-[50%] left-[50%] -translate-x-[50%]
            -translate-y-[50%] action-button text-white bg-gradient-to-r
          dark:from-dark-link-button from-primary-link-button to-[#ff00e5]
          dark:to-[#ff00e5] px-3 py-2 rounded-md"
          >
            Subscribe
          </Link>
        </div>
      ) : (
        <>
          <PostBody content={post.content} />
          <PostFooter post={post} comments={post.comments} />
        </>
      )}
    </div>
  )
}
