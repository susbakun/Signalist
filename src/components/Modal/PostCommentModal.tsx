import { CommentInput, PostBody, PostComment, PostFooter, PostTopBar } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { PostModel } from "@/shared/models"
import { Modal } from "flowbite-react"

type PostCommentMoalProps = {
  openModal: boolean
  handleCloseCommentsModal: () => void
  comments: PostModel["comments"]
  post: Omit<PostModel, "comments">
  handleOpenEditPostModal?: () => void
}

export const PostCommentModal = ({
  openModal,
  handleCloseCommentsModal,
  comments,
  post,
  handleOpenEditPostModal
}: PostCommentMoalProps) => {
  const { currentUser: me } = useCurrentUser()
  const sortedComments = [...comments].sort((a, b) => b.date - a.date)
  const { user: publisher } = post

  if (!me) return null

  return (
    <Modal size="3xl" show={openModal} onClose={handleCloseCommentsModal}>
      <Modal.Header className="border-none pb-0" />
      <Modal.Body
        className="flex flex-col md:flex-row py-0 px-0 mb-0 max-h-[60vh]
        overflow-y-auto custom-modal"
      >
        <div
          className="pl-4 md:pl-6 pr-4 pb-6 flex w-full md:w-[50%] md:border-r
        border-r-gray-600/20 dark:border-r-white/20
          flex-col gap-4 md:sticky top-0"
        >
          <PostTopBar
            handleOpenEditPostModal={handleOpenEditPostModal}
            postId={post.id}
            {...publisher}
            date={post.date}
          />
          <PostBody
            isPremium={post.isPremium}
            publisherUsername={publisher.username}
            content={post.content}
          />
          <PostFooter myAccount={me} simplified={true} post={post} />
        </div>
        <div className="w-full md:w-[50%] flex flex-col gap-4 relative border-t md:border-t-0 border-t-gray-600/20 dark:border-t-white/20 pt-4 md:pt-0">
          {sortedComments &&
            sortedComments.map((comment, index) => (
              <PostComment
                key={comment.commentId}
                {...comment}
                isLastComment={index === sortedComments.length - 1}
              />
            ))}
          {me && <CommentInput postId={post.id} commentPublisher={me} />}
          {!me && <div className="p-4 text-center text-gray-500">Please log in to comment</div>}
        </div>
      </Modal.Body>
    </Modal>
  )
}
