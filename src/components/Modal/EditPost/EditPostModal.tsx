import { ImagePreview, PostModalFooter, PostTextArea } from "@/components"
import { editPost } from "@/features/Post/postsSlice"
import { appwriteEndpoint, appwritePostsBucketId, appwriteProjectId } from "@/shared/constants"
import { PostModel } from "@/shared/models"
import { Client, ID, ImageFormat, ImageGravity, Storage } from "appwrite"
import { Modal } from "flowbite-react"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
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
  const [postButtonDisabled, setPostButtonDisabled] = useState(true)
  const [isPostSending, setIsPostSending] = useState(false)

  const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

  const storage = new Storage(client)

  const dispatch = useDispatch()

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
    const postImageId = await handleSendImage(selectedImage)
    const removePostImage = postImageId ? false : true
    dispatch(editPost({ content: postText, postId: post.id, postImageId, removePostImage }))
    handleResetForm()
  }

  const handlePostTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value)
  }

  const handleTogglePremium = () => {
    setIsPremium((prev) => !prev)
  }

  const handleResetFileInput = () => {
    if (!post.postImageId) {
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
      const file = new File([selectedFile], "screenshot.png", { type: "image/png" })
      try {
        const response = await storage.createFile(appwritePostsBucketId, ID.unique(), file)
        console.log("Image uploaded successfully:", response)
        return response.$id
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }

  useEffect(() => {
    if (!post.postImageId) {
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
    if (post.postImageId) {
      const result = storage.getFilePreview(
        appwritePostsBucketId,
        post.postImageId,
        0,
        0,
        ImageGravity.Center,
        100,
        0,
        "fff",
        0,
        1,
        0,
        "fff",
        ImageFormat.Png
      )
      setImagePreview(result.href)
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
