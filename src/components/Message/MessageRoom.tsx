import { MessageRoomInput, MessageRoomMessages } from "@/components"
import { sendMessage, useAppSelector } from "@/features/Message/messagesSlice"
import { ChatType, SimplifiedAccountType } from "@/shared/types"
import { Client, ID, Storage } from "appwrite"
import { ChangeEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"

type MessageRoomOutletType = {
  messages: ChatType[]
  userInfo: SimplifiedAccountType
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)

  const myAccount = useAppSelector((state) => state.users).find(
    (user) => user.username === "Amir_Aryan"
  )

  const { messages, userInfo } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch()
  const { id } = useParams()

  const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66747b890009cb1b3f8a")

  const storage = new Storage(client)

  const handleSendMessage = async () => {
    if (messageText.trim() === "") return
    const messageImageId = await handleSendImage(selectedImage)
    setMessageText("")
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
        const response = await storage.createFile("6685c7c700292b19c096", ID.unique(), file)
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
      <h2 className="text-2xl font-bold mb-4">{userInfo.name}</h2>
      <MessageRoomMessages messages={messages} handleBlurEmojiPicker={handleBlurEmojiPicker} />
      <MessageRoomInput
        messageText={messageText}
        isEmojiPickerOpen={isEmojiPickerOpen}
        selectedImage={selectedImage}
        handleChangeMessageText={handleChangeMessageText}
        handleSelectEmoji={handleSelectEmoji}
        handleSendMessage={handleSendMessage}
        handleToggleEmojiPicker={handleToggleEmojiPicker}
        handleChangeImage={handleChangeImage}
      />
    </>
  )
}
