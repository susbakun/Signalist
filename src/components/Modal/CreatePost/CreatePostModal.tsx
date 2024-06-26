import { MediaOptionsButton } from "@/components/Button/MediaOptions/MediaOptionsButton"
import { createPost } from "@/features/Post/postsSlice"
import { useAppSelector } from "@/features/User/usersSlice"
import { SimplifiedAccountType } from "@/shared/types"
import { cn, isDarkMode } from "@/utils"
import { Modal } from "flowbite-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import Toggle from "react-toggle"
import "./togglebutton.css"

export type CreatePostModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const CreatePostModal = ({ openModal, handleCloseModal }: CreatePostModalProps) => {
  const [isPremium, setIsPremium] = useState(false)
  const [postText, setPostText] = useState("")

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )!

  const postPublisher: SimplifiedAccountType = {
    name: myAccount.name,
    username: myAccount.username,
    imageUrl: myAccount.imageUrl
  }

  const dispatch = useDispatch()
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      hanldeCreatePost()
    }
  }

  const hanldeCreatePost = () => {
    dispatch(createPost({ content: postText, publisher: postPublisher, isPremium }))
    handleCloseModal!()
    setPostText("")
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
            <MediaOptionsButton />
            <label className={cn("flex items-center gap-1", { dark: isDarkMode() })}>
              <span>Premium</span>
              <Toggle onChange={handleTogglePremium} defaultChecked={isPremium} icons={false} />
            </label>
          </div>
          <button
            onClick={hanldeCreatePost}
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
