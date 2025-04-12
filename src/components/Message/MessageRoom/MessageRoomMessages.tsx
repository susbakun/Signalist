import { Loader } from "@/components" // Adjust the import path as needed
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { ChatType } from "@/shared/types"
import { cn, formatMessageDate, getAvatarPlaceholder, getCurrentUsername } from "@/utils"
import moment from "jalali-moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type MessageRoomMessagesProps = {
  messages: ChatType[]
  isGroup: boolean
  handleBlurEmojiPicker: () => void
}

type MessagesIsImageLoadedType = {
  [k: string]: boolean
}

export const MessageRoomMessages = ({
  messages,
  isGroup,
  handleBlurEmojiPicker
}: MessageRoomMessagesProps) => {
  const [enlargedImageHref, setEnlargedImageHref] = useState<string>("")
  const [enlarged, setEnlarged] = useState(false)
  const [areImagesLoading, setAreImagesLoading] = useState<MessagesIsImageLoadedType>({})
  const { getProperAvatar } = useUserMessageRoom()

  const handleImageEnlarge = (messageImageHref?: string) => {
    if (messageImageHref) {
      setEnlarged(true)
      setEnlargedImageHref(messageImageHref)
    }
  }

  const handleCloseEnlargedImageView = () => {
    setEnlarged(false)
    setEnlargedImageHref("")
  }

  useEffect(() => {
    const loadingStates: MessagesIsImageLoadedType = {}

    for (const message of messages) {
      if (message.messageImageHref) {
        loadingStates[message.messageImageHref] = true
      }
    }

    setAreImagesLoading(loadingStates)
  }, [messages])

  const handleImageLoaded = (imageHref: string) => {
    setAreImagesLoading((prevState) => ({ ...prevState, [imageHref]: false }))
  }

  const parseMessageText = (text: string) => {
    const words = text.split(" ")
    return words.map((word, index) => {
      if (word.startsWith("#")) {
        const hashtag = word.substring(1)
        return (
          <Link key={index} to={`/hashtag/${hashtag}`} className="text-blue-500 hover:underline">
            {word}
          </Link>
        )
      } else {
        return <span key={index}>{word} </span>
      }
    })
  }

  return (
    <>
      <div onClick={handleBlurEmojiPicker} className="overflow-hidden space-y-6 px-2 pt-4 pb-16">
        {messages.reduce((acc: JSX.Element[], message, index) => {
          const messageDate = formatMessageDate(message.date)
          const prevMessageDate = index > 0 ? formatMessageDate(messages[index - 1].date) : null
          const messageImageHref = message.messageImageHref

          if (messageDate !== prevMessageDate) {
            acc.push(
              <div
                key={`date-${messageDate}`}
                className="text-center text-gray-500 dark:text-gray-400 my-2"
              >
                {messageDate}
              </div>
            )
          }

          const currentUsername = getCurrentUsername()
          const isCurrentUser = message.sender.username === currentUsername

          acc.push(
            <div
              key={index}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} items-center`}
            >
              {isGroup && (
                <div
                  className={`flex flex-col gap-2 justify-center items-center
                  ${isCurrentUser ? "order-2" : "order-1"}`}
                >
                  <span className="text-center text-xs font-semibold -translate-x-[6px]">
                    {message.sender.username}
                  </span>
                  <span
                    className="inline-block px-2 cursor-pointer"
                    onClick={() => handleImageEnlarge(message.sender.imageUrl)}
                  >
                    {getProperAvatar(
                      getAvatarPlaceholder(message.sender.name),
                      message.sender,
                      undefined
                    )}
                  </span>
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-xs relative mx-2 overflow-hidden ${
                  isCurrentUser
                    ? "bg-primary-link-button dark:bg-dark-link-button text-white order-1"
                    : "dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-gray-100 order-2"
                }`}
              >
                {messageImageHref && areImagesLoading[messageImageHref] && (
                  <Loader className="flex items-center justify-center h-[250px] w-[250px]" />
                )}
                {messageImageHref && (
                  <div
                    className="relative w-full rounded mb-4"
                    onClick={() => handleImageEnlarge(messageImageHref)}
                  >
                    <img
                      className={cn(
                        "w-full object-cover cursor-pointer transition-opacity duration-300",
                        areImagesLoading[messageImageHref] ? "opacity-0 h-0" : "opacity-100"
                      )}
                      src={messageImageHref}
                      alt="message image"
                      onLoad={() => handleImageLoaded(messageImageHref)}
                      onError={() => handleImageLoaded(messageImageHref)}
                    />
                  </div>
                )}
                <p
                  className={`${isCurrentUser ? "text-start" : "text-end"} break-words overflow-wrap overflow-hidden`}
                >
                  {parseMessageText(message.text)}
                </p>
                <div
                  className={`text-xs text-gray-500 dark:text-gray-400 py-1 flex w-full ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {moment(message.date).format("h:mm A")}
                </div>
              </div>
            </div>
          )
          return acc
        }, [])}
      </div>

      {enlarged && enlargedImageHref && (
        <div
          className="fixed inset-0 z-50 h-screen flex items-center
          justify-center bg-black bg-opacity-75"
          onClick={handleCloseEnlargedImageView}
        >
          <img
            className="w-[70%] h-[70%] object-contain"
            src={enlargedImageHref}
            alt="Enlarged Message"
          />
        </div>
      )}
    </>
  )
}
