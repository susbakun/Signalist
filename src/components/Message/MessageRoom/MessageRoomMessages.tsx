import { Loader } from "@/components" // Adjust the import path as needed
import { useUserMessageRoom } from "@/hooks/useUserMessageRoom"
import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { ChatType } from "@/shared/types"
import { cn, formatMessageDate, getAvatarPlaceholder } from "@/utils"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
import moment from "jalali-moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type MessageRoomMessagesProps = {
  messages: ChatType[]
  isGroup: boolean
  handleBlurEmojiPicker: () => void
}

type MessagesHrefsType = {
  [k: string]: string
}

type MessagesIsImageLoadedType = {
  [k: string]: boolean
}

export const MessageRoomMessages = ({
  messages,
  isGroup,
  handleBlurEmojiPicker
}: MessageRoomMessagesProps) => {
  const [messageImageHrefs, setMessageImageHrefs] = useState<MessagesHrefsType>({})
  const [enlargedImageHref, setEnlargedImageHref] = useState<string>("")
  const [enlarged, setEnlarged] = useState(false)
  const [areImagesLoading, setAreImagesLoading] = useState<MessagesIsImageLoadedType>({})
  const { getProperAvatar } = useUserMessageRoom()

  const client = new Client()
  const storage = new Storage(client)
  client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

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
    const fetchImages = async () => {
      const hrefs: MessagesHrefsType = {}
      const loadingStates: MessagesIsImageLoadedType = {}
      for (const message of messages) {
        if (message.messageImageId) {
          try {
            loadingStates[message.messageImageId] = true
            const result = storage.getFilePreview(
              appwriteMessagesBucketId,
              message.messageImageId,
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
            hrefs[message.messageImageId] = result.href
          } catch (error) {
            console.error("Error fetching image: ", error)
          }
        }
      }
      setMessageImageHrefs(hrefs)
      setAreImagesLoading(loadingStates)
    }

    fetchImages()
  }, [messages])

  const handleImageLoaded = (imageId: string) => {
    setAreImagesLoading((prevState) => ({ ...prevState, [imageId]: false }))
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
      <div onClick={handleBlurEmojiPicker} className="flex-grow overflow-y-auto space-y-6 p-4">
        {messages.reduce((acc: JSX.Element[], message, index) => {
          const messageDate = formatMessageDate(message.date)
          const prevMessageDate = index > 0 ? formatMessageDate(messages[index - 1].date) : null
          const messageImageHref = messageImageHrefs[message.messageImageId || ""]
          const messageImageId = message.messageImageId || ""

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

          const isCurrentUser = message.sender.username === "Amir_Aryan"

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
                    className="inline-block px-4 cursor-pointer"
                    onClick={() => handleImageEnlarge(message.sender.imageUrl)}
                  >
                    {getProperAvatar(
                      getAvatarPlaceholder(message.sender.username),
                      message.sender,
                      undefined
                    )}
                  </span>
                </div>
              )}

              <div
                className={`p-3 rounded-lg max-w-xs relative ${
                  isCurrentUser
                    ? "bg-primary-link-button dark:bg-dark-link-button text-white"
                    : "dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-gray-100"
                } ${isCurrentUser ? "order-1" : "order-2"} translate-y-4`}
              >
                {areImagesLoading[messageImageId] && (
                  <Loader className="flex items-center justify-center h-[250px] w-[250px]" />
                )}
                {messageImageHref && (
                  <div
                    className={"relative w-full h-full rounded mb-4"}
                    onClick={() => handleImageEnlarge(messageImageHref)}
                  >
                    <img
                      className={cn(
                        "w-full h-full object-cover cursor-pointer",
                        "transition-opacity duration-300 opacity-100",
                        {
                          "opacity-0 h-0 w-0": areImagesLoading[messageImageId]
                        }
                      )}
                      src={messageImageHref}
                      alt="message image"
                      onLoad={() => handleImageLoaded(messageImageId)}
                      onError={() => handleImageLoaded(messageImageId)}
                    />
                  </div>
                )}
                <p className="text-end">{parseMessageText(message.text)}</p>
                <div
                  className={cn(
                    `text-xs text-gray-500 dark:text-gray-400 py-1 flex w-full justify-end`,
                    { "justify-start": isCurrentUser }
                  )}
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
