import { Loader } from "@/components" // Adjust the import path as needed
import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { ChatType } from "@/shared/types"
import { cn, formatMessageDate } from "@/utils"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
import moment from "jalali-moment"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type MessageRoomMessagesProps = {
  messages: ChatType[]
  handleBlurEmojiPicker: () => void
}

type MessagesHrefsType = {
  [k: string]: string
}

type MessagesIsImageLoadedType = {
  [k: string]: boolean
}

export const MessageRoomMessages = ({
  handleBlurEmojiPicker,
  messages
}: MessageRoomMessagesProps) => {
  const [messageImageHrefs, setMessageImageHrefs] = useState<MessagesHrefsType>({})
  const [enlargedImageHref, setEnlargedImageHref] = useState<string>("")
  const [enlarged, setEnlarged] = useState(false)
  const [areImagesLoading, setAreImagesLoading] = useState<MessagesIsImageLoadedType>({})

  const client = new Client()
  const storage = new Storage(client)
  client.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId)

  const handleImageEnlarge = (messageImageHref: string) => {
    setEnlarged(true)
    setEnlargedImageHref(messageImageHref)
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
      <div onClick={handleBlurEmojiPicker} className="flex-grow overflow-y-auto space-y-4">
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

          acc.push(
            <div
              key={index}
              className={`flex ${message.sender.username === "Amir_Aryan" ? "justify-end" : "justify-start"} items-center`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.sender.username === "Amir_Aryan"
                    ? "bg-primary-link-button dark:bg-dark-link-button text-white"
                    : "dark:bg-gray-700 bg-gray-200 text-gray-600 dark:text-gray-100"
                }`}
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
                <p>{parseMessageText(message.text)}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {moment(message.date).format("h:mm A")}
              </span>
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
