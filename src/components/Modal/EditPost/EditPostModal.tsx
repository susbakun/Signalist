import { PostModalFooter, PostModalImagePreview } from "@/components"
import { editPost } from "@/features/Post/postsSlice"
import { PostModel } from "@/shared/models"
import { Client, ID, Storage } from "appwrite"
import { Modal } from "flowbite-react"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { PostTextArea } from "../CreatePost/PostTextArea"
import "./togglebutton.css"

export type EditPostModalProps = {
  openModal: boolean
  handleCloseModal: () => void
  post: PostModel
}

export const EditPostModal = ({ openModal, handleCloseModal, post }: EditPostModalProps) => {
  const [isPremium, setIsPremium] = useState(false)
  const [postText, setPostText] = useState(post.content)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [postButtonDisabled, setPostButtonDisabled] = useState(false)

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66747b890009cb1b3f8a")

  const storage = new Storage(client)

  const dispatch = useDispatch()
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEditPost()
    }
  }

  const handleEditPost = async () => {
    setPostButtonDisabled(true)
    const postImageId = await handleSendImage(selectedImage)
    dispatch(editPost({ content: postText, postId: post.id, postImageId }))
    handleCloseModal!()
  }

  const handlePostTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }

  const handleTogglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  const handleResetFileInput = () => {
    setImagePreview(null)
    handleCancelSelectImage()
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleCancelSelectImage = () => {
    setSelectedImage(undefined)
  }

  const handleSendImage = async (selectedFile: File | undefined) => {
    if (selectedFile) {
      const file = new File([selectedFile], "screenshot.png", { type: "image/png" })
      try {
        const response = await storage.createFile("6684ee4300354ad8d7bb", ID.unique(), file)
        console.log("Image uploaded successfully:", response)
        return response.$id
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    if (selectedImage) reader.readAsDataURL(selectedImage)
  }, [selectedImage])

  return (
    <Modal size="xl" show={openModal} onClose={handleCloseModal}>
      <Modal.Header className="border-none pr-1 py-2" />
      <Modal.Body
        className="flex overflow-y-auto
      flex-col gap-2 py-0 mb-0 px-2 custom-modal"
      >
        <PostTextArea
          postText={postText}
          handlePostTextChange={handlePostTextChange}
          handleKeyDown={handleKeyDown}
        />
        <PostModalImagePreview
          handleResetInput={handleResetFileInput}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
        />
        <PostModalFooter
          isPremium={isPremium}
          handleChangeImage={handleChangeImage}
          handleTogglePremium={handleTogglePremium}
          hanldeCreatePost={handleEditPost}
          postButtonDisabled={postButtonDisabled}
        />
      </Modal.Body>
    </Modal>
  )
}
