import { EditPostModal, PostBody, PostFooter, PostTopBar } from "@/components"
import { useAppSelector } from "@/features/Post/postsSlice"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { AccountModel, PostModel } from "@/shared/models"
import { ComponentProps, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

type PostProps = {
  post: PostModel
  myAccount: AccountModel
} & ComponentProps<"div">

export const Post = ({ post, myAccount, className }: PostProps) => {
  const { publisher } = post
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const publisherDetails = useAppSelector((store) => store.users.users).find(
    (user) => user.username === publisher.username
  )

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked, areYouBlocked } = useIsUserBlocked(myAccount)

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

  if (!publisherDetails) return null

  if (isUserBlocked || areYouBlocked(publisherDetails)) return null

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
          postImageHref={post.postImageHref}
          amISubscribed={amISubscribed}
        />
        <PostFooter
          post={post}
          comments={post.comments}
          simplified={false}
          amISubscribed={amISubscribed}
          handleOpenEditPostModal={handleOpenEditPostModal}
          myAccount={myAccount}
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
