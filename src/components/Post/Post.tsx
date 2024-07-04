import { EditPostModal, PostBody, PostFooter, PostTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { userIsUserBlocked } from "@/hooks/userIsUserBlocked"
import { PostModel } from "@/shared/models"
import { useEffect, useState } from "react"

type PostProps = {
  post: PostModel
}

export const Post = ({ post }: PostProps) => {
  const { publisher } = post
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked } = userIsUserBlocked(myAccount)

  const handleOpenEditPostModal = () => {
    setIsEditPostModalOpen(true)
  }

  const hanldeCloseEditPostModal = () => {
    setIsEditPostModalOpen(false)
  }

  useEffect(() => {
    if (myAccount) {
      const userUsername = post.publisher.username
      setIsUserBlocked(determineIsUserBlocked(userUsername))
    }
  }, [myAccount])

  if (isUserBlocked) return

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
          postImageId={post.postImageId}
        />
        <PostFooter
          handleOpenEditPostModal={handleOpenEditPostModal}
          amISubscribed={amISubscribed}
          post={post}
          comments={post.comments}
        />
      </div>
      <EditPostModal
        post={post}
        openModal={isEditPostModalOpen}
        handleCloseModal={hanldeCloseEditPostModal}
      />
    </>
  )
}
