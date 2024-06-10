import { editPost } from '@/features/Post/postsSlice'
import { PostModel } from '@/shared/models'
import { cn, isDarkMode } from '@/utils'
import { Modal } from 'flowbite-react'
import { useState } from 'react'
import { CiLink } from 'react-icons/ci'
import { useDispatch } from 'react-redux'
import Toggle from 'react-toggle'
import './togglebutton.css'

export type EditPostModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  post: PostModel
}

export const EditPostModal = ({ openModal, handleCloseModal, post }: EditPostModalProps) => {
  const [isPremium, setIsPremium] = useState(false)
  const [postText, setPostText] = useState(post.content)

  const dispatch = useDispatch()
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEditPost()
    }
  }

  const handleEditPost = () => {
    dispatch(editPost({ content: postText, postId: post.id }))
    handleCloseModal!()
  }

  const handleTogglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  return (
    <Modal size="xl" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-0 px-2 custom-modal"
      >
        <div
          className="h-[20vh] dark:bg-gray-600
          w-full flex justify-center px-2
        bg-gray-200 rounded-md"
        >
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a text..."
            className="resize-none border-none outline-none
            dark:bg-gray-600 w-full h-full bg-gray-200 rounded-md"
          ></textarea>
        </div>
        <div className="flex justify-between px-2 pb-2">
          <div className="flex items-center gap-2">
            <button className="action-button">
              <CiLink className="w-8 h-8" />
            </button>
            <label className={cn('flex items-center gap-1', { dark: isDarkMode() })}>
              <span>Premium</span>
              <Toggle onChange={handleTogglePremium} defaultChecked={isPremium} icons={false} />
            </label>
          </div>
          <button
            onClick={handleEditPost}
            className="action-button dark:text-dark-link-button
          text-primary-link-button font-bold"
          >
            Post
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
