import { ImagePreview, PostTextArea } from "@/components"
import { createPostAsync } from "@/features/Post/postsSlice"
import { SimplifiedAccountType } from "@/shared/types"
import { Modal } from "flowbite-react"
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { PostModalFooter } from "./PostModalFooter"
import "./togglebutton.css"
import { AppDispatch } from "@/app/store"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export type CreatePostModalProps = {
  openModal: boolean
  handleCloseModal: () => void
}

export const CreatePostModal = ({ openModal, handleCloseModal }: CreatePostModalProps) => {
  const [isPremium, setIsPremium] = useState(false)
  const [postText, setPostText] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [postButtonDisabled, setPostButtonDisabled] = useState(false)
  const [isPostSending, setIsPostSending] = useState(false)

  const { currentUser: myAccount } = useCurrentUser()

  const postPublisher: SimplifiedAccountType | undefined = myAccount
    ? {
        name: myAccount.name,
        username: myAccount.username,
        imageUrl: myAccount.imageUrl
      }
    : undefined

  const dispatch = useDispatch<AppDispatch>()

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleCreatePost()
    }
  }

  const handlePostTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }

  const hanldeResetForm = () => {
    handleCloseModal!()
    setPostText("")
    setPostButtonDisabled(false)
    setIsPostSending(false)
  }

  const handleCreatePost = async () => {
    if (!postPublisher || !postText.trim() || isPostSending) return

    try {
      setPostButtonDisabled(true)
      setIsPostSending(true)
      const postImageHref = await handleSendImage(selectedImage)
      await dispatch(
        createPostAsync({ content: postText, publisher: postPublisher, isPremium, postImageHref })
      ).unwrap()
      hanldeResetForm()
    } catch (error) {
      console.error("Failed to create post:", error)
      setPostButtonDisabled(false)
    } finally {
      setIsPostSending(false)
    }
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
      const formData = new FormData()
      formData.append("file", selectedFile)
      try {
        const response = await fetch("https://signalist-backend.liara.run/api/upload/posts", {
          method: "POST",
          body: formData
        })
        const data = await response.json()
        console.log("Image uploaded successfully:", data)
        return data.url
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
      <Modal.Header className="border-none pr-1 py-2 mobile:py-1" />
      <Modal.Body
        className="flex overflow-y-auto
        flex-col gap-2 py-0 mb-0 px-2 mobile:px-1 custom-modal"
      >
        <PostTextArea
          postText={postText}
          handlePostTextChange={handlePostTextChange}
          handleKeyDown={handleKeyDown}
        />
        <ImagePreview handleResetInput={handleResetFileInput} imagePreview={imagePreview} />
        <PostModalFooter
          isPremium={isPremium}
          isPostSending={isPostSending}
          handleChangeImage={handleChangeImage}
          handleTogglePremium={handleTogglePremium}
          hanldeCreatePost={handleCreatePost}
          postButtonDisabled={postButtonDisabled}
        />
      </Modal.Body>
    </Modal>
  )
}
