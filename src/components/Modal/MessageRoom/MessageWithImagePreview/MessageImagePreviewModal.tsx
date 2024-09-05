import { MessageWithImagePreviewInput } from "@/components"
import { Modal } from "flowbite-react"
import { ChangeEvent, useState } from "react"

type MessageIMagePreviewModalProps = {
  isOpen: boolean
  messageText: string
  isMessageSending: boolean
  imagePreview: string | null
  handleSelectEmoji: (emoji: string) => void
  handleChangeMessageText: (e: ChangeEvent<HTMLTextAreaElement>) => void
  sendMessage: () => Promise<void>
  closeModal: () => void
}

export const MessageImagePreviewModal = ({
  isOpen,
  messageText,
  imagePreview,
  isMessageSending,
  handleChangeMessageText,
  handleSelectEmoji,
  sendMessage,
  closeModal
}: MessageIMagePreviewModalProps) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false)

  const handleSendMessage = async () => {
    setSendButtonDisabled(true)
    await sendMessage()
    closeModal()
  }

  const handleToggleEmojiPicker = () => {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  const handleCloseEmojiPicker = () => {
    setIsEmojiPickerOpen(false)
  }

  const handleCloseModal = () => {
    handleCloseEmojiPicker()
    closeModal()
  }

  if (imagePreview) {
    return (
      <Modal show={isOpen} onClose={handleCloseModal} size="xl" position="center">
        <Modal.Header className="pt-2 pb-0 border-none" />
        <Modal.Body onClick={handleCloseEmojiPicker} className="pt-0 flex flex-col">
          <div className="flex justify-center items-center min-h-[300px]">
            <img src={imagePreview} alt="Preview" className="max-w-full max-h-[80vh]" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <MessageWithImagePreviewInput
            isMessageSending={isMessageSending}
            messageText={messageText}
            sendButtonDisabled={sendButtonDisabled}
            isEmojiPickerOpen={isEmojiPickerOpen}
            handleChangeMessageText={handleChangeMessageText}
            handleSelectEmoji={handleSelectEmoji}
            handleSendMessage={handleSendMessage}
            handleToggleEmojiPicker={handleToggleEmojiPicker}
          />
        </Modal.Footer>
      </Modal>
    )
  }
}
