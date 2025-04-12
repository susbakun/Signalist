import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { AppDispatch } from "@/app/store"
import {
  fetchConversationMessages,
  sendMessage,
  sendMessageAsync
} from "@/features/Message/messagesSlice"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import * as messagesApi from "@/services/messagesApi"
import { backendUrl } from "@/shared/constants"
import { MessageModel } from "@/shared/models"
import { ChangeEvent, useEffect, useRef, useState } from "react"
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
  const [socketConnected, setSocketConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const { currentUser: myAccount } = useCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()
  const { id: roomId } = useParams()

  // Initialize socket connection
  useEffect(() => {
    if (!myAccount?.username) return

    // Fix the socket URL to always connect to the correct backend
    // Remove the trailing '/api' if it exists
    let socketUrl = backendUrl
    if (socketUrl.endsWith("/api")) {
      socketUrl = socketUrl.replace(/\/api$/, "")
    }

    console.log(`Connecting to socket at: ${socketUrl}`)

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      transports: ["websocket", "polling"] // Try WebSocket first, fall back to polling
    })

    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id)
      setSocketConnected(true)
      // Authenticate with username
      newSocket.emit("authenticate", myAccount.username)

      // When connected, join the room if it's a group chat
      if (myMessages.isGroup && roomId) {
        newSocket.emit("joinRoom", roomId)
      }
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setSocketConnected(false)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setSocketConnected(false)

      // Attempt to reconnect if disconnection wasn't intentional
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, try to reconnect
        newSocket.connect()
      }
    })

    newSocket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data)
    })

    // Handle incoming messages
    newSocket.on("newMessage", (data) => {
      console.log("Received message:", data)
      if (data.roomId === roomId) {
        // Only update UI if the message is from someone else
        // This prevents duplicate messages when we send a message ourselves
        if (data.message.sender.username !== myAccount?.username) {
          dispatch(
            sendMessage({
              sender: data.message.sender,
              text: data.message.text,
              roomId: data.roomId,
              messageImageHref: data.message.messageImageHref
            })
          )
        }
      }
    })

    // If this is a group chat, join the room
    if (myMessages.isGroup && roomId) {
      newSocket.emit("joinRoom", roomId)
    }

    socketRef.current = newSocket

    // Load conversation messages from database to ensure we have all messages
    if (roomId) {
      dispatch(fetchConversationMessages(roomId))
    }

    // Cleanup
    return () => {
      if (myMessages.isGroup && roomId) {
        newSocket.emit("leaveRoom", roomId)
      }
      newSocket.disconnect()
      socketRef.current = null
    }
  }, [roomId, myAccount?.username, myMessages.isGroup, dispatch])

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) return
    if (!myAccount || !roomId) return

    setIsMessageSending(true)
    let messageImageHref: string | undefined = undefined

    try {
      // Handle image upload if present
      if (selectedImage) {
        try {
          // Upload image to backend
          const response = await messagesApi.uploadMessageImage(selectedImage)
          messageImageHref = response.url || response.messageImageHref
        } catch (error) {
          console.error("Failed to upload image:", error)
          // Continue sending the message without the image
        }
      }

      // Create message object
      const messageData = {
        sender: myAccount,
        text: messageText,
        roomId,
        messageImageHref
      }

      // First update local state so the message appears immediately
      dispatch(
        sendMessage({
          sender: myAccount,
          text: messageText,
          roomId,
          messageImageHref
        })
      )

      // Send to API for persistence
      const resultAction = await dispatch(sendMessageAsync(messageData))

      if (sendMessageAsync.fulfilled.match(resultAction)) {
        console.log("Message saved to database successfully")

        // Emit through socket for real-time delivery to other users,
        // flagging that this message has already been handled by the API
        if (socketRef.current && socketConnected) {
          console.log("Emitting message via socket with API flag:", messageData)
          socketRef.current.emit("sendMessage", {
            roomId,
            message: {
              sender: myAccount,
              text: messageText,
              messageImageHref,
              date: new Date().getTime()
            },
            isGroup: myMessages.isGroup,
            fromAPI: true // Flag to indicate this message came through the API
          })
        }
      }

      setMessageText("")
      setSelectedImage(undefined)
      setIsEmojiPickerOpen(false)
    } catch (error) {
      console.error("Failed to send message:", error)
      // No need for fallback since we already updated state at the beginning
    } finally {
      setIsMessageSending(false)
    }
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0])
    }
  }

  const handleChangeMessageText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value)

    // Emit typing indicator via socket
    if (socketRef.current && socketConnected && roomId) {
      socketRef.current.emit("typing", {
        roomId,
        isTyping: true
      })

      // Clear typing indicator after 2 seconds of inactivity
      setTimeout(() => {
        if (socketRef.current && socketConnected) {
          socketRef.current.emit("typing", {
            roomId,
            isTyping: false
          })
        }
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

      {/* Messages container - increased padding for mobile */}
      <div className="flex-1 overflow-y-auto pb-36 md:pb-24">
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
