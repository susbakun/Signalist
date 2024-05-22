import { CommentInput, PostBody, PostComment, PostFooter, PostTopBar } from '@/components'
import { useAppSelector } from '@/features/Post/postsSlice'
import { PostModel } from '@/shared/models'
import { Modal } from 'flowbite-react'

type PostCommentMoalProps = {
  openModal: boolean
  handleCloseCommentsModal: () => void
  comments: PostModel['comments']
  post: Omit<PostModel, 'comments'>
}

export const PostCommentModal = ({
  openModal,
  handleCloseCommentsModal,
  comments,
  post
}: PostCommentMoalProps) => {
  const me = useAppSelector((state) => state.users).find((user) => user.username === 'Amir_Aryan')
  const sortedComments = [...comments].sort((a, b) => b.date - a.date)
  return (
    <Modal size="3xl" show={openModal} onClose={handleCloseCommentsModal}>
      <Modal.Header className="border-none pb-0" />
      <Modal.Body
        className="flex py-0 px-0 mb-0 max-h-[60vh]
        overflow-y-auto custom-modal"
      >
        <div
          className="pl-6 pr-4 pb-6 flex w-[50%] border-r
        border-r-gray-600/20 dark:border-r-white/20
          flex-col gap-4 sticky top-0"
        >
          <PostTopBar postId={post.id} {...post.publisher} date={post.date} />
          <PostBody
            isPremium={post.isPremium}
            publisherUsername={post.publisher.username}
            content={post.content}
          />
          <PostFooter simplified={true} post={post} />
        </div>
        <div className="w-[50%] flex flex-col gap-4 relative">
          {sortedComments &&
            sortedComments.map((comment, index) => (
              <PostComment
                key={comment.commentId}
                {...comment}
                isLastComment={index === sortedComments.length - 1}
              />
            ))}
          <CommentInput postId={post.id} commentPublisher={me!} />
        </div>
      </Modal.Body>
    </Modal>
  )
}
