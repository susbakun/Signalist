import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { MessageModel } from "@/shared/models"
import { ChangeEvent, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { ToastContainer } from "@/components/Shared/ToastContainer"
import { useToastContainer } from "@/hooks/useToastContainer"
import { useDispatch } from "react-redux"
import { sendMessageAsync } from "@/features/Message/messagesSlice"
import { AppDispatch } from "@/app/store"
import { getCurrentUser } from "@/utils"

type MessageRoomOutletType = {
  myMessages: MessageModel["username"]["roomId"]
  onBack: () => void
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isMessageSending] = useState(false)

  const { id: roomId } = useParams()
  const currentUser = getCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()

  const { showToast, toastContent, toastType } = useToastContainer()

  const handleSendMessage = async () => {
    if (!messageText.trim() || !roomId) return

    await dispatch(
      sendMessageAsync({
        sender: currentUser,
        roomId,
        messageImageHref: undefined,
        text: messageText
      })
    )

    setMessageText("")
    setIsEmojiPickerOpen(false)
    setSelectedImage(undefined)
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
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
      <div className="h-screen md:flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 md:relative md:w-auto fixed w-full inset-0">
        {/* Header */}
        <div className="sticky top-0 left-0 right-0 z-20 bg-gray-100 dark:bg-gray-900 shadow-md">
          <MessageRoomTopBar myMessages={myMessages} onBack={onBack} />
        </div>

        {/* Messages container - increased padding for mobile */}
        <div className="flex-1 overflow-y-auto pb-48 md:pb-24">
          <MessageRoomMessages
            isGroup={myMessages.isGroup}
            messages={myMessages.messages}
            handleBlurEmojiPicker={handleBlurEmojiPicker}
          />
        </div>

        <div
          className="md:sticky md:bottom-0 md:left-0 md:right-0 md:w-auto
          fixed bottom-16 left-0 right-0 w-full z-30 bg-gray-100 dark:bg-gray-900
          border-t border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div
            className="md:hidden fixed left-0 right-0 h-16 bottom-0
          bg-gray-100 dark:bg-gray-900 z-20"
          ></div>
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

      {/* Add toast container */}
      <ToastContainer showToast={showToast} toastContent={toastContent} toastType={toastType} />
    </>
  )
}
