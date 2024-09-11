import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { sendMessage, useAppSelector } from "@/features/Message/messagesSlice"
import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { Client, ID, Storage } from "appwrite"
import { ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"

type MessageRoomOutletType = {
  myMessages: MessageModel["username"]["roomId"]
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isMessageSending, setIsMessageSending] = useState(false)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )
  const { myMessages } = useOutletContext<MessageRoomOutletType>()
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
    <>
      <MessageRoomTopBar myMessages={myMessages} />
      <MessageRoomMessages
        isGroup={myMessages.isGroup}
        messages={myMessages.messages}
        handleBlurEmojiPicker={handleBlurEmojiPicker}
      />
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
    </>
  )
}
