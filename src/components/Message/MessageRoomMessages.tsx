import { appwriteEndpoint } from "@/shared/constants"
import { ChatType } from "@/shared/types"
import { formatMessageDate } from "@/utils"
import { Client, ImageFormat, ImageGravity, Storage } from "appwrite"
import moment from "jalali-moment"
import { useEffect, useState } from "react"

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

  const client = new Client()
  const storage = new Storage(client)
  client.setEndpoint(appwriteEndpoint).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

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
      const hrefs: HrefsObjectType = {}
      for (const message of messages) {
        if (message.messageImageId) {
          try {
            const result = storage.getFilePreview(
              "import.meta.env.VITE_APPWRITE_MESSAGES_BUCKET_ID",
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
                {messageImageHref && (
                  <div
                    className={"relative w-full h-full rounded mb-4"}
                    onClick={() => handleImageEnlarge(messageImageHref)}
                  >
                    <img
                      className={
                        "w-full h-full object-cover cursor-pointer transition-transform duration-300"
                      }
                      src={messageImageHref}
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
          className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black bg-opacity-75"
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
