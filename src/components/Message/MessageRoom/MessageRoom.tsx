import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { sendMessage, useAppSelector } from "@/features/Message/messagesSlice"
import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { getCurrentUsername } from "@/utils"
import { Client, ID, Storage } from "appwrite"
import { ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"

type MessageRoomOutletType = {
  myMessages: MessageModel["username"]["roomId"]
  onBack: () => void
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isMessageSending, setIsMessageSending] = useState(false)

  const currentUsername = getCurrentUsername()
  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === currentUsername
  )
  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch()
  const { id } = useParams()

  const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

  const storage = new Storage(client)

  const handleSendMessage = async () => {
    setIsMessageSending(true)
    const messageImageId = await handleSendImage(selectedImage)
    setMessageText("")
    setIsMessageSending(false)
    setIsEmojiPickerOpen(false)
    dispatch(sendMessage({ sender: myAccount, text: messageText, roomId: id, messageImageId }))
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleSendImage = async (selectedFile: File | undefined) => {
    if (selectedFile) {
      const file = new File([selectedFile], "screenshot.png", { type: "image/png" })
      try {
        const response = await storage.createFile(appwriteMessagesBucketId, ID.unique(), file)
        console.log("Image uploaded successfully:", response)
        return response.$id
      } catch (error) {
        console.error("Failed to upload image:", error)
      }
    }
  }

  const handleChangeMessageText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value)
  }

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  const handleSelectEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji)
  }

  const handleBlurEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  return (
    <div className="flex flex-col h-screen fixed md:sticky right-0 top-0 inset-0 bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900">
        <MessageRoomTopBar myMessages={myMessages} onBack={onBack} />
      </div>
      <div className="flex-1 overflow-y-auto mt-16 mb-24 pb-4">
        <MessageRoomMessages
          isGroup={myMessages.isGroup}
          messages={myMessages.messages}
          handleBlurEmojiPicker={handleBlurEmojiPicker}
        />
      </div>
      <div className="absolute bottom-16 md:bottom-4 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-900">
        <MessageRoomInput
          messageText={messageText}
          isEmojiPickerOpen={isEmojiPickerOpen}
          selectedImage={selectedImage}
          handleChangeMessageText={handleChangeMessageText}
          handleSelectEmoji={handleSelectEmoji}
          handleSendMessage={handleSendMessage}
          handleToggleEmojiPicker={handleToggleEmojiPicker}
          handleChangeImage={handleChangeImage}
          isMessageSending={isMessageSending}
        />
      </div>
    </div>
  )
}
