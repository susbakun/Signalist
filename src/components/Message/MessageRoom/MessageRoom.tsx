import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { AppDispatch } from "@/app/store"
import { sendMessage, sendMessageAsync } from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import * as messagesApi from "@/services/messagesApi"
import { backendUrl } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket } from "socket.io-client"
import io from "socket.io-client"

type MessageRoomOutletType = {
  myMessages: MessageModel["username"]["roomId"]
  onBack: () => void
}

export const MessageRoom = () => {
  const [messageText, setMessageText] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined)
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const { currentUser: myAccount } = useCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()
  const { id: roomId } = useParams()

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(backendUrl.replace("/api", ""))

    newSocket.on("connect", () => {
      console.log("Socket connected")
      // Authenticate with username
      if (myAccount?.username) {
        newSocket.emit("authenticate", myAccount.username)
      }
    })

    newSocket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data)
    })

    // Handle incoming messages
    newSocket.on("newMessage", (data) => {
      if (data.roomId === roomId) {
        // Update the UI with the new message
        // We can also dispatch to Redux but that would cause a double update
        // since the message is already stored in the backend
        dispatch(
          sendMessage({
            sender: data.message.sender,
            text: data.message.text,
            roomId: data.roomId,
            messageImageHref: data.message.messageImageHref
          })
        )
      }
    })

    // If this is a group chat, join the room
    if (myMessages.isGroup && roomId) {
      newSocket.emit("joinRoom", roomId)
    }

    setSocket(newSocket)

    // Cleanup
    return () => {
      if (myMessages.isGroup && roomId) {
        newSocket.emit("leaveRoom", roomId)
      }
      newSocket.disconnect()
    }
  }, [roomId, myAccount?.username, myMessages.isGroup, dispatch])

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) return

    setIsMessageSending(true)
    let messageImageHref: string | undefined = undefined

    // Handle image upload if present
    if (selectedImage) {
      try {
        // Upload image to backend
        const response = await messagesApi.uploadMessageImage(selectedImage)
        messageImageHref = response.messageImageHref
      } catch (error) {
        console.error("Failed to upload image:", error)
        setIsMessageSending(false)
        return // If image upload fails, abort the message send
      }
    }

    // Send the message through API and Redux
    try {
      if (roomId && myAccount) {
        // Send message via API first
        await dispatch(
          sendMessageAsync({
            sender: myAccount,
            text: messageText,
            roomId,
            messageImageHref
          })
        ).unwrap()

        // Emit message via socket as well for real-time
        if (socket && socket.connected) {
          socket.emit("sendMessage", {
            roomId,
            message: {
              sender: myAccount,
              text: messageText,
              messageImageHref,
              date: new Date().getTime()
            },
            isGroup: myMessages.isGroup
          })
        }
      }
    } catch (error) {
      console.error("Failed to send message via API, falling back to Redux only", error)

      if (!myAccount || !roomId) return

      // Fallback to local Redux state only
      dispatch(
        sendMessage({
          sender: myAccount,
          text: messageText,
          roomId,
          messageImageHref
        })
      )
    }

    setMessageText("")
    setSelectedImage(undefined)
    setIsMessageSending(false)
    setIsEmojiPickerOpen(false)
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleChangeMessageText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value)

    // Emit typing indicator via socket
    if (socket && socket.connected && roomId) {
      socket.emit("typing", {
        roomId,
        isTyping: true
      })

      // Clear typing indicator after 2 seconds of inactivity
      setTimeout(() => {
        socket.emit("typing", {
          roomId,
          isTyping: false
        })
      }, 2000)
    }
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
    <div className="h-screen md:flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 md:relative md:w-auto fixed w-full inset-0">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 z-20 bg-gray-100 dark:bg-gray-900 shadow-md">
        <MessageRoomTopBar myMessages={myMessages} onBack={onBack} />
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto pb-28 md:pb-24">
        <MessageRoomMessages
          isGroup={myMessages.isGroup}
          messages={myMessages.messages}
          handleBlurEmojiPicker={handleBlurEmojiPicker}
        />
      </div>

      <div className="md:sticky md:bottom-0 md:left-0 md:right-0 md:w-auto fixed bottom-16 left-0 right-0 w-full z-30 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="md:hidden fixed left-0 right-0 h-16 bottom-0 bg-gray-100 dark:bg-gray-900 z-20"></div>
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
  )
}
