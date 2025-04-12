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
import { ChatType } from "@/shared/types"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useOutletContext, useParams } from "react-router-dom"
import { Socket, ManagerOptions, SocketOptions } from "socket.io-client"
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
  const processedMessagesRef = useRef<Set<string>>(new Set()) // Track processed message IDs

  const { currentUser: myAccount } = useCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()
  const { id: roomId } = useParams()

  // Update the processed messages set when messages change
  useEffect(() => {
    // When messages update from Redux, update our processed IDs set
    if (myMessages?.messages) {
      const currentIds = new Set(processedMessagesRef.current)
      myMessages.messages.forEach((msg) => {
        if (msg.id) {
          currentIds.add(msg.id)
        } else if (msg.date) {
          // If no ID exists, use date + sender + text as a unique key
          const uniqueKey = `${msg.date}-${msg.sender.username}-${msg.text.substring(0, 10)}`
          currentIds.add(uniqueKey)
        }
      })
      processedMessagesRef.current = currentIds
    }
  }, [myMessages?.messages])

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
      reconnectionAttempts: Infinity, // Never stop trying to reconnect
      reconnectionDelay: 500, // Start with a shorter delay
      reconnectionDelayMax: 2000, // Maximum delay between reconnections
      timeout: 5000, // Shorter timeout
      autoConnect: true,
      transports: ["websocket"], // Only use websocket for faster connections
      forceNew: false, // Reuse existing connection if possible
      upgrade: false // Don't try to upgrade to websocket if already connected
    } as Partial<ManagerOptions & SocketOptions>) // Properly type the socket options

    // Use a heartbeat to keep connection active
    const heartbeatInterval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("heartbeat", { username: myAccount.username })
      }
    }, 8000)

    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id)
      setSocketConnected(true)
      // Authenticate with username
      newSocket.emit("authenticate", myAccount.username)

      // When connected, join the room if it's a group chat
      if (myMessages.isGroup && roomId) {
        newSocket.emit("joinRoom", roomId)
      }

      // Request any missed messages
      if (roomId && myMessages.messages.length > 0) {
        const lastMessageTimestamp = myMessages.messages[myMessages.messages.length - 1].date
        newSocket.emit("syncMessages", { roomId, since: lastMessageTimestamp })
      }
    })

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      setSocketConnected(false)
      // Try to reconnect immediately once
      setTimeout(() => newSocket.connect(), 500)
    })

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
      setSocketConnected(false)

      // Attempt to reconnect for any reason
      setTimeout(() => {
        console.log("Attempting to reconnect...")
        newSocket.connect()
      }, 500)
    })

    newSocket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data)
    })

    // Handle incoming messages
    newSocket.on("newMessage", (data) => {
      console.log("Received message:", data)
      if (data.roomId === roomId) {
        // Skip if this is our own message reflected back from the server
        // This prevents duplicate messages when we send a message ourselves
        if (data.message.own === true) {
          console.log("Skipping own message from server")
          return
        }

        // Check if we've already processed this message by ID
        const messageId =
          data.message.id ||
          `${data.message.date}-${data.message.sender.username}-${data.message.text.substring(0, 10)}`
        if (processedMessagesRef.current.has(messageId)) {
          console.log(`Skipping already processed message: ${messageId}`)
          return
        }

        // Mark message as processed
        processedMessagesRef.current.add(messageId)

        const isSelfMessage = data.message.sender.username === myAccount?.username
        // Only process self messages if they're not duplicates of ones we already added
        if (!isSelfMessage || (isSelfMessage && !data.message.pending)) {
          // Use optimistic update pattern
          dispatch(
            sendMessage({
              sender: data.message.sender,
              text: data.message.text,
              roomId: data.roomId,
              messageImageHref: data.message.messageImageHref
            })
          )

          // Scroll to bottom on new message
          setTimeout(() => {
            const messagesContainer = document.querySelector(".overflow-y-auto")
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight
            }
          }, 50)
        }
      }
    })

    // Handle synced messages to catch up on missed messages
    newSocket.on("syncedMessages", (data) => {
      console.log("Received synced messages:", data)
      if (data.roomId === roomId && data.messages && data.messages.length > 0) {
        // Process each message, but avoid duplicates
        data.messages.forEach((message: ChatType & { id?: string }) => {
          // Create a unique ID for the message if it doesn't have one
          const messageId =
            message.id ||
            `${message.date}-${message.sender.username}-${message.text.substring(0, 10)}`

          // Skip if we've already processed this message
          if (processedMessagesRef.current.has(messageId)) {
            console.log(`Skipping synced message: ${messageId}`)
            return
          }

          // Mark as processed and add to Redux
          processedMessagesRef.current.add(messageId)

          dispatch(
            sendMessage({
              sender: message.sender,
              text: message.text,
              roomId: data.roomId,
              messageImageHref: message.messageImageHref
            })
          )
        })
      }
    })

    // Handle message updates (like image uploads completing)
    newSocket.on("messageUpdated", (data) => {
      console.log("Message updated:", data)
      if (data.roomId === roomId && roomId) {
        // Instead of refreshing all messages, we could optimize this later
        // to just update the specific message in the Redux store
        dispatch(fetchConversationMessages(roomId))
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
      clearInterval(heartbeatInterval)
      if (myMessages.isGroup && roomId) {
        newSocket.emit("leaveRoom", roomId)
      }
      newSocket.disconnect()
      socketRef.current = null
      // Clear processed message tracking on unmount
      processedMessagesRef.current.clear()
    }
  }, [roomId, myAccount?.username, myMessages.isGroup, dispatch])

  const handleSendMessage = async () => {
    if (!messageText.trim() && !selectedImage) return
    if (!myAccount || !roomId) return

    // Store current values to avoid race conditions
    const currentText = messageText.trim()
    const currentImage = selectedImage

    // Prevent duplicate sends by disabling sending state
    if (isMessageSending) return
    setIsMessageSending(true)

    // Clear input immediately for better UX
    setMessageText("")
    setSelectedImage(undefined)
    setIsEmojiPickerOpen(false)

    // Create a unique message ID for this message
    const tempMessageId = Date.now().toString()
    const messageDate = Date.now()

    let messageImageHref: string | undefined = undefined

    try {
      // First update local state so the message appears immediately - with pending flag
      dispatch(
        sendMessage({
          sender: myAccount,
          text: currentText,
          roomId,
          messageImageHref: undefined // We'll update this later if we have an image
        })
      )

      // Scroll to bottom immediately after adding the message
      setTimeout(() => {
        const messagesContainer = document.querySelector(".overflow-y-auto")
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 50)

      // Send via socket first for real-time delivery (before image upload)
      if (socketRef.current && socketConnected) {
        socketRef.current.emit("sendMessage", {
          roomId,
          message: {
            sender: myAccount,
            text: currentText,
            messageImageHref: undefined, // No image yet
            date: messageDate,
            id: tempMessageId,
            pending: true // Flag that this message might be updated
          },
          isGroup: myMessages.isGroup
        })
      }

      // Handle image upload in parallel
      if (currentImage) {
        try {
          // Upload image to backend
          const response = await messagesApi.uploadMessageImage(currentImage)
          messageImageHref = response.url || response.messageImageHref

          // Update the message with the image URL
          if (messageImageHref) {
            dispatch(
              sendMessage({
                sender: myAccount,
                text: currentText,
                roomId,
                messageImageHref
              })
            )

            // Update via socket that image is now available
            if (socketRef.current && socketConnected) {
              socketRef.current.emit("updateMessage", {
                roomId,
                messageId: tempMessageId,
                updates: {
                  messageImageHref,
                  pending: false
                }
              })
            }
          }
        } catch (error) {
          console.error("Failed to upload image:", error)
        }
      } else {
        // If no image, mark as not pending after a short delay
        setTimeout(() => {
          if (socketRef.current && socketConnected) {
            socketRef.current.emit("updateMessage", {
              roomId,
              messageId: tempMessageId,
              updates: {
                pending: false
              }
            })
          }
        }, 300)
      }

      // Create message object for API
      const messageData = {
        sender: myAccount,
        text: currentText,
        roomId,
        messageImageHref
      }

      // Send to API for persistence (can happen in parallel)
      dispatch(sendMessageAsync(messageData)).catch((error) => {
        console.error("Failed to persist message:", error)

        // Retry once after a delay if API call fails
        setTimeout(() => {
          dispatch(sendMessageAsync(messageData)).catch((error) => {
            console.error("Failed to persist message after retry:", error)
          })
        }, 3000)
      })
    } catch (error) {
      console.error("Failed to send message:", error)
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
      <div className="flex-1 overflow-y-auto pb-48 md:pb-24">
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
