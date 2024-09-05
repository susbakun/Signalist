import { MediaOptionsButton, MessageImagePreviewModal } from "@/components"
import { cn, isDarkMode } from "@/utils"
import Tippy from "@tippyjs/react"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { Spinner } from "flowbite-react"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { BsEmojiGrin } from "react-icons/bs"
import { MdOutlineKeyboardVoice } from "react-icons/md"
import { roundArrow } from "tippy.js"

type MessageRoomInputProps = {
  messageText: string
  isEmojiPickerOpen: boolean
  selectedImage: File | undefined
  isMessageSending: boolean
  handleSendMessage: () => Promise<void>
  handleToggleEmojiPicker: () => void
  handleSelectEmoji: (emoji: string) => void
  handleChangeMessageText: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleChangeImage: (e: ChangeEvent<HTMLInputElement>) => void
}

export const MessageRoomInput = ({
  messageText,
  selectedImage,
  isEmojiPickerOpen,
  isMessageSending,
  handleSendMessage,
  handleSelectEmoji,
  handleChangeMessageText,
  handleToggleEmojiPicker,
  handleChangeImage
}: MessageRoomInputProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleFocusOrBlurInput = () => {
    setIsInputFocused((prev) => !prev)
  }

  const isInputEmpty = () => {
    return messageText === ""
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCloseImagePreviewModal = () => {
    setIsImagePreviewModalOpen(false)
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [messageText])

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    if (selectedImage) {
      setIsImagePreviewModalOpen(true)
      reader.readAsDataURL(selectedImage)
    }
  }, [selectedImage])

  return (
    <div className="p-4">
      {isEmojiPickerOpen && (
        <div className="relative">
          <EmojiPicker
            open={isEmojiPickerOpen}
            theme={isDarkMode() ? Theme.DARK : Theme.LIGHT}
            onEmojiClick={(e) => handleSelectEmoji(e.emoji)}
            width={350}
            height={400}
            style={{
              position: "absolute",
              bottom: "0px",
              backgroundColor: isDarkMode() ? "rgb(31 41 55)" : "white"
            }}
          />
        </div>
      )}
      <div
        className={cn(
          "mt-4 flex px-3 py-1 w-full rounded-2xl border-2",
          "bg-gray-200 dark:bg-gray-800 text-gray-600",
          "dark:text-gray-100 justify-center items-center",
          "border-transparent",
          { "border-primary-link-button": isInputFocused },
          { "dark:border-dark-link-button": isInputFocused }
        )}
      >
        <button
          onClick={handleToggleEmojiPicker}
          className={cn(
            "mr-1 action-button",
            { "dark:text-dark-link-button": isEmojiPickerOpen },
            { "text-primary-link-button": isEmojiPickerOpen }
          )}
        >
          <BsEmojiGrin className="w-5 h-5" />
        </button>
        <button className="action-button px-2 py-2">
          <MdOutlineKeyboardVoice className="w-6 h-6" />
        </button>
        <textarea
          ref={textareaRef}
          value={isImagePreviewModalOpen ? "" : messageText}
          onChange={handleChangeMessageText}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="w-full px-1 py-2 bg-gray-200 dark:bg-gray-800
        dark:text-gray-100 placeholder-gray-500 text-gray-600
          border-none ring-0 focus:ring-0 resize-none max-h-40 overflow-y-auto"
          onFocus={handleFocusOrBlurInput}
          onBlur={handleFocusOrBlurInput}
          rows={1}
        ></textarea>
        <div className="flex gap-2 items-center">
          <Tippy
            content="Media"
            className="dark:bg-gray-700 bg-gray-900 text-white font-sans
            rounded-md px-1 py-[2px] text-sm"
            delay={[1000, 0]}
            placement="top"
            animation="fade"
            arrow={roundArrow}
            offset={[0, 8]}
            duration={10}
            hideOnClick={true}
          >
            <MediaOptionsButton handleChangeImage={handleChangeImage} />
          </Tippy>
          <button
            disabled={isInputEmpty()}
            onClick={handleSendMessage}
            className="action-button text-white
            font-bold disabled:opacity-30
            px-[10px] py-1 rounded-lg flex items-center gap-2 
            dark:bg-dark-link-button bg-primary-link-button"
          >
            {isMessageSending && !isImagePreviewModalOpen && <Spinner color="success" size="md" />}
            Send
          </button>
        </div>
      </div>
      <MessageImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        imagePreview={imagePreview}
        messageText={messageText}
        sendMessage={handleSendMessage}
        isMessageSending={isMessageSending}
        handleChangeMessageText={handleChangeMessageText}
        handleSelectEmoji={handleSelectEmoji}
        closeModal={handleCloseImagePreviewModal}
      />
    </div>
  )
}
