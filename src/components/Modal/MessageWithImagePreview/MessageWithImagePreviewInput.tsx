import { cn, isDarkMode } from "@/utils"
import EmojiPicker, { Theme } from "emoji-picker-react"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { BsEmojiGrin } from "react-icons/bs"

type MessageWithImagePreviewInputProps = {
  messageText: string
  isEmojiPickerOpen: boolean
  sendButtonDisabled: boolean
  handleSelectEmoji: (emoji: string) => void
  handleToggleEmojiPicker: () => void
  handleChangeMessageText: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleSendMessage: () => Promise<void>
}

export const MessageWithImagePreviewInput = ({
  messageText,
  isEmojiPickerOpen,
  sendButtonDisabled,
  handleSelectEmoji,
  handleToggleEmojiPicker,
  handleChangeMessageText,
  handleSendMessage
}: MessageWithImagePreviewInputProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false)

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [messageText])

  return (
    <>
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
            "mr-1",
            { "dark:text-dark-link-button": isEmojiPickerOpen },
            { "text-primary-link-button": isEmojiPickerOpen }
          )}
        >
          <BsEmojiGrin className="w-5 h-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={messageText}
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
          <button
            disabled={isInputEmpty() || sendButtonDisabled}
            onClick={handleSendMessage}
            className="text-primary-link-button py-0 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}
