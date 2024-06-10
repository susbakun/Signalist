import { EditPostModal, PostBody, PostFooter, PostTopBar } from '@/components'
import { useIsUserSubscribed } from '@/hooks/useIsUserSubscribed'
import { PostModel } from '@/shared/models'
import { useState } from 'react'

type PostProps = {
  post: PostModel
}

export const Post = ({ post }: PostProps) => {
  const { publisher } = post
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)

  const { amISubscribed } = useIsUserSubscribed(publisher)

  const handleOpenEditPostModal = () => {
    setIsEditPostModalOpen(true)
  }

  const hanldeCloseEditPostModal = () => {
    setIsEditPostModalOpen(false)
  }

  return (
    <>
      <div
        className="border-y border-y-gray-600/20 dark:border-y-white/20 px-4 py-6 flex
      flex-col gap-4"
      >
        <PostTopBar
          handleOpenEditPostModal={handleOpenEditPostModal}
          subscribed={amISubscribed}
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
      <EditPostModal
        post={post}
        openModal={isEditPostModalOpen}
        handleCloseModal={hanldeCloseEditPostModal}
      />
    </>
  )
}
