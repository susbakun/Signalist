import { EditPostModal, PostBody, PostFooter, PostTopBar } from "@/components"
import { useAppSelector } from "@/features/Message/messagesSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { PostModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { ComponentProps, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

type PostProps = {
  post: PostModel
} & ComponentProps<"div">

export const Post = ({ post, className }: PostProps) => {
  const { publisher } = post
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)
  const currentUsername = getCurrentUsername()

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === currentUsername
  )

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked } = useIsUserBlocked(myAccount)

  const handleOpenEditPostModal = () => {
    setIsEditPostModalOpen(true)
  }

  const handleCloseEditPostModal = () => {
    setIsEditPostModalOpen(false)
  }

  useEffect(() => {
    if (myAccount) {
      const userUsername = post.publisher.username
      setIsUserBlocked(determineIsUserBlocked(userUsername))
    }
  }, [myAccount])

  if (isUserBlocked) return null

  return (
    <>
      <div className={twMerge("flex flex-col gap-4", className)}>
        <PostTopBar
          handleOpenEditPostModal={handleOpenEditPostModal}
          subscribed={amISubscribed}
          postId={post.id}
          {...publisher}
          date={post.date}
        />
        <PostBody
          content={post.content}
          publisherUsername={post.publisher.username}
          isPremium={post.isPremium}
          postImageId={post.postImageId}
          amISubscribed={amISubscribed}
        />
        <PostFooter
          post={post}
          comments={post.comments}
          simplified={false}
          amISubscribed={amISubscribed}
          handleOpenEditPostModal={handleOpenEditPostModal}
        />
      </div>
      {isEditPostModalOpen && (
        <EditPostModal
          post={post}
          openModal={isEditPostModalOpen}
          handleCloseModal={handleCloseEditPostModal}
        />
      )}
    </>
  )
}
