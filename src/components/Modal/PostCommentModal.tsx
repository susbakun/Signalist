import { PostComment } from '@/components'
import { PostModel } from '@/shared/models'
import { Modal } from 'flowbite-react'

type PostCommentMoalProps = {
  openModal: boolean
  handleCloseCommentsModal: () => void
  comments: PostModel['comments']
}

export const PostCommentModal = ({
  openModal,
  handleCloseCommentsModal,
  comments
}: PostCommentMoalProps) => {
  return (
    <Modal size="xl" show={openModal} onClose={handleCloseCommentsModal}>
      <Modal.Header className="border-none pb-0" />
      <Modal.Body className="flex flex-col mx-0 pt-0 gap-3">
        {comments.map((comment) => (
          <PostComment key={comment.commentId} {...comment} />
        ))}
      </Modal.Body>
    </Modal>
  )
}
