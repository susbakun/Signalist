import { appwriteEndpoint, appwriteMessagesBucketId, appwriteProjectId } from "@/shared/constants"
import { ChatType } from "@/shared/types"
import { cn, formatMessageDate } from "@/utils"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
import moment from "jalali-moment"
import { useEffect, useState } from "react"
import { Loader } from "../Shared/Loader"

type MessageRoomMessagesProps = {
  messages: ChatType[]
  handleBlurEmojiPicker: () => void
}

type HrefsObjectType = {
  [k: string]: string
}

export const MessageRoomMessages = ({
  handleBlurEmojiPicker,
  messages
}: MessageRoomMessagesProps) => {
  const [messageImageHrefs, setMessageImageHrefs] = useState<HrefsObjectType>({})
  const [enlargedImageHref, setEnlargedImageHref] = useState<string>("")
  const [enlarged, setEnlarged] = useState(false)
  const [isImageLoading, setisImageLoading] = useState(false)

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

  const handleImageLoaded = () => {
    setisImageLoading(false)
  }

  useEffect(() => {
    const fetchImages = async () => {
      const hrefs: HrefsObjectType = {}
      for (const message of messages) {
        if (message.messageImageId) {
          setisImageLoading(true)
          try {
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
    }

    fetchImages()
  }, [messages])

  return (
    <>
      <div onClick={handleBlurEmojiPicker} className="flex-grow overflow-y-auto space-y-4">
        {messages.reduce((acc: JSX.Element[], message, index) => {
          const messageDate = formatMessageDate(message.date)
          const prevMessageDate = index > 0 ? formatMessageDate(messages[index - 1].date) : null
          const messageImageHref = messageImageHrefs[message.messageImageId || ""]

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
                {isImageLoading && <Loader className="h-[350px]" />}{" "}
                {messageImageHref && (
                  <div
                    className={"relative w-full h-full rounded mb-4"}
                    onClick={() => handleImageEnlarge(messageImageHref)}
                  >
                    <img
                      className={cn(
                        "w-full h-full object-cover cursor-pointer",
                        "transition-transform duration-300 opacity-100",
                        { "opacity-0": isImageLoading }
                      )}
                      src={messageImageHref}
                      onLoad={handleImageLoaded}
                      alt="message image"
                    />
                  </div>
                )}
                <p>{message.text}</p>
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
