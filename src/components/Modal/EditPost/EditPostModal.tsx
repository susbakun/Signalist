import { ImagePreview, PostModalFooter, PostTextArea } from "@/components"
import { editPostAsync } from "@/features/Post/postsSlice"
import { PostModel } from "@/shared/models"
import { Modal } from "flowbite-react"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import "./togglebutton.css"
import { AppDispatch } from "@/app/store"
import { backendUrl } from "@/shared/constants"

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
  const [postButtonDisabled, setPostButtonDisabled] = useState(true)
  const [isPostSending, setIsPostSending] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEditPost()
    }
  }

  const handleResetForm = () => {
    handleResetFileInput()
    setPostButtonDisabled(false)
    setIsPostSending(false)
    handleCloseModal!()
  }

  const handleEditPost = async () => {
    setPostButtonDisabled(true)
    setIsPostSending(true)
    const postImageHref = await handleSendImage(selectedImage)
    const removePostImage = !postImageHref && !post.postImageHref
    await dispatch(
      editPostAsync({ postId: post.id, content: postText, postImageHref, removePostImage })
    )
    handleResetForm()
  }

  const handlePostTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }

  const handleTogglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  const handleResetFileInput = () => {
    if (!post.postImageHref) {
      setPostButtonDisabled(true)
    }
    setImagePreview(null)
    handleCancelSelectImage()
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPostButtonDisabled(false)
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
        const response = await fetch(`${backendUrl}/upload/posts`, {
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
    if (!post.postImageHref) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      if (selectedImage) reader.readAsDataURL(selectedImage)
    }
  }, [selectedImage])

  useEffect(() => {
    setPostText(post.content)
    setIsPremium(post.isPremium)
    setSelectedImage(undefined)
    setPostButtonDisabled(true)
    if (post.postImageHref) {
      setImagePreview(post.postImageHref)
    } else {
      setImagePreview(null)
    }
  }, [openModal])

  useEffect(() => {
    if (post.isPremium !== isPremium || post.content !== postText) {
      setPostButtonDisabled(false)
    } else if (post.isPremium === isPremium || post.content === postText) {
      setPostButtonDisabled(true)
    }
  }, [isPremium, postText])

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
        <ImagePreview imagePreview={imagePreview} handleResetInput={handleResetFileInput} />
        <PostModalFooter
          isPremium={isPremium}
          isPostSending={isPostSending}
          handleChangeImage={handleChangeImage}
          handleTogglePremium={handleTogglePremium}
          hanldeCreatePost={handleEditPost}
          postButtonDisabled={postButtonDisabled}
        />
      </Modal.Body>
    </Modal>
  )
}
