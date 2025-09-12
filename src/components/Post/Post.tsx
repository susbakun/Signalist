import { EditPostModal, PostBody, PostFooter, PostTopBar } from "@/components"
import { useIsUserBlocked } from "@/hooks/useIsUserBlocked"
import { useIsUserSubscribed } from "@/hooks/useIsUserSubscribed"
import { useUserAccount } from "@/hooks/useUserAccount"
import { AccountModel, PostModel } from "@/shared/models"
import { ComponentProps, useEffect, useState, useMemo, memo } from "react"
import { twMerge } from "tailwind-merge"

type PostProps = {
  post: PostModel
  myAccount: AccountModel
} & ComponentProps<"div">

export const Post = memo(({ post, myAccount, className }: PostProps) => {
  const { user: publisher } = post
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false)
  const [isUserBlocked, setIsUserBlocked] = useState<undefined | boolean>(undefined)

  const { userAccount: publisherDetails } = useUserAccount(publisher.username)

  const { amISubscribed } = useIsUserSubscribed(publisher)
  const { isUserBlocked: determineIsUserBlocked, areYouBlocked } = useIsUserBlocked(myAccount)

  const handleOpenEditPostModal = () => {
    setIsEditPostModalOpen(true)
  }

  const handleCloseEditPostModal = () => {
    setIsEditPostModalOpen(false)
  }

  const isBlocked = useMemo(() => {
    if (!myAccount) return false
    return determineIsUserBlocked(publisher.username)
  }, [myAccount, determineIsUserBlocked, publisher.username])

  useEffect(() => {
    setIsUserBlocked(isBlocked)
  }, [isBlocked])

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
          publisherUsername={publisher.username}
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
})
