import { MessageRoomInput, MessageRoomMessages, MessageRoomTopBar } from "@/components"
import { AppDispatch } from "@/app/store"
import {
  fetchConversationMessages,
  sendMessage,
  sendMessageAsync,
  SendMessagePayload
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
  const pendingMessagesRef = useRef<Set<string>>(new Set()) // Track pending API messages
  const socketDisconnectTimeRef = useRef<number | null>(null) // Track last disconnect time

  const { currentUser: myAccount } = useCurrentUser()

  const { myMessages, onBack } = useOutletContext<MessageRoomOutletType>()
  const dispatch = useDispatch<AppDispatch>()
  const { id: roomId } = useParams()

  // Generate a unique, consistent message ID that can be used for deduplication
  const generateMessageId = (sender: string, text: string, timestamp: number): string => {
    return `${timestamp}-${sender}-${text.substring(0, 20)}`.replace(/\s+/g, "-")
  }

  // Update the processed messages set when messages change
  useEffect(() => {
    // When messages update from Redux, update our processed IDs set
    if (myMessages?.messages) {
      const currentIds = new Set(processedMessagesRef.current)
      myMessages.messages.forEach((msg) => {
        if (msg.id) {
          currentIds.add(msg.id)
        } else if (msg.date && msg.sender) {
          // If no ID exists, use date + sender + text as a unique key
          const uniqueKey = generateMessageId(msg.sender.username, msg.text, msg.date)
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

      // Request any missed messages with client-side message IDs to help server with deduplication
      if (roomId && myMessages.messages.length > 0) {
        const lastMessageTimestamp = myMessages.messages[myMessages.messages.length - 1].date
        // Collect existing message IDs to help server exclude them from sync
        const existingMessageIds = Array.from(processedMessagesRef.current)

        // Don't sync messages if we just temporarily disconnected (within last 30 seconds)
        // This prevents unnecessary syncs on brief disconnections
        const lastDisconnectTime = socketDisconnectTimeRef.current
        const now = Date.now()
        const shouldSync = !lastDisconnectTime || now - lastDisconnectTime > 30000

        if (shouldSync) {
          console.log("Syncing messages since:", new Date(lastMessageTimestamp))
          newSocket.emit("syncMessages", {
            roomId,
            since: lastMessageTimestamp,
            existingIds: existingMessageIds
          })
        } else {
          console.log("Skipping sync due to recent disconnection")
        }
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
      // Record the disconnect time
      socketDisconnectTimeRef.current = Date.now()

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
      console.log("Received message via socket:", data)
      if (!data.roomId || !data.message || data.roomId !== roomId) return

      // Skip if this is our own message reflected back from the server
      if (data.message.sender.username === myAccount.username) {
        console.log("Skipping own message from server")
        return
      }

      // Generate consistent message ID
      const messageId =
        data.message.id ||
        generateMessageId(data.message.sender.username, data.message.text, data.message.date)

      // Check if we've already processed this message
      if (processedMessagesRef.current.has(messageId)) {
        console.log(`Skipping already processed message: ${messageId}`)
        return
      }

      // Check for similar messages within the last 30 seconds
      const existingMessages = myMessages.messages || []
      const hasSimilarRecentMessage = existingMessages.some(
        (msg) =>
          msg.sender.username === data.message.sender.username &&
          msg.text === data.message.text &&
          Math.abs(new Date(msg.date).getTime() - new Date(data.message.date).getTime()) < 30000 // Within 30 seconds
      )

      if (hasSimilarRecentMessage) {
        console.log(`Skipping duplicate message based on content and time`)
        return
      }

      // Mark message as processed
      processedMessagesRef.current.add(messageId)

      // Add to Redux store
      dispatch(
        sendMessage({
          sender: data.message.sender,
          text: data.message.text,
          roomId: data.roomId,
          messageImageHref: data.message.messageImageHref,
          date: data.message.date,
          id: messageId,
          pending: data.message.pending || false // Track if message is still pending
        } as SendMessagePayload)
      )

      // Scroll to bottom on new message
      setTimeout(() => {
        const messagesContainer = document.querySelector(".overflow-y-auto")
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 50)
    })

    // NEW EVENT: Listen for messages persisted notification
    // This helps ensure all users have the latest messages
    newSocket.on("messagesPersisted", (data) => {
      if (data.roomId === roomId) {
        console.log("Messages have been persisted on server, refreshing conversation")
        // Fetch latest messages to ensure we have consistent state
        if (roomId) {
          dispatch(fetchConversationMessages(roomId))
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
            message.id || generateMessageId(message.sender.username, message.text, message.date)

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
              messageImageHref: message.messageImageHref,
              date: message.date,
              id: messageId,
              // Mark synced messages as not pending
              pending: false
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
      pendingMessagesRef.current.clear()
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

    // Generate a consistent message ID using timestamp for client-side
    const messageDate = Date.now()
    const messageId = generateMessageId(myAccount.username, currentText, messageDate)

    // Add to processed messages immediately to prevent duplication
    processedMessagesRef.current.add(messageId)
    pendingMessagesRef.current.add(messageId)

    let messageImageHref: string | undefined = undefined

    try {
      // First update local state so the message appears immediately
      dispatch(
        sendMessage({
          sender: myAccount,
          text: currentText,
          roomId,
          messageImageHref: undefined, // We'll update this later if we have an image
          date: messageDate,
          id: messageId,
          pending: true // Mark as pending initially
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
            id: messageId,
            pending: true, // Flag that this message might be updated
            fromAPI: false // Flag this didn't come from the API
          },
          isGroup: myMessages.isGroup
        })
      }

      // NEW: Add retry mechanism if socket is not connected
      let socketRetries = 0
      const maxSocketRetries = 3
      const socketRetryInterval = setInterval(() => {
        if (!socketConnected && socketRetries < maxSocketRetries) {
          console.log(`Retry ${socketRetries + 1}/${maxSocketRetries} sending via socket`)
          if (socketRef.current) {
            socketRef.current.emit("sendMessage", {
              roomId,
              message: {
                sender: myAccount,
                text: currentText,
                messageImageHref: messageImageHref, // Use updated image if available
                date: messageDate,
                id: messageId,
                pending: true,
                fromAPI: false
              },
              isGroup: myMessages.isGroup
            })
          }
          socketRetries++
        } else {
          clearInterval(socketRetryInterval)
        }
      }, 1000)

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
                messageImageHref,
                date: messageDate,
                id: messageId,
                pending: true // Still pending until confirmed by server
              })
            )

            // Update via socket that image is now available
            if (socketRef.current && socketConnected) {
              socketRef.current.emit("updateMessage", {
                roomId,
                messageId: messageId,
                updates: {
                  messageImageHref,
                  pending: true // Still pending until API confirms
                }
              })
            }
          }
        } catch (error) {
          console.error("Failed to upload image:", error)
        }
      }

      // Create message object for API
      const messageData = {
        sender: myAccount,
        text: currentText,
        roomId,
        messageImageHref,
        id: messageId
      }

      // Mark in Redux that API call is being made
      pendingMessagesRef.current.add(messageId)

      // Send to API for persistence
      await dispatch(sendMessageAsync(messageData))
        .then((result) => {
          console.log("Message persisted via API:", result)

          // If the message successfully sent via API, flag this to the socket server
          // so it knows not to broadcast it again
          if (socketRef.current && socketConnected) {
            socketRef.current.emit("sendMessage", {
              roomId,
              message: {
                sender: myAccount,
                text: currentText,
                messageImageHref: messageImageHref,
                date: messageDate,
                id: messageId,
                fromAPI: true, // Flag this came from the API
                pending: false // No longer pending
              },
              isGroup: myMessages.isGroup
            })
          }

          // Update socket message to mark as not pending
          if (socketRef.current && socketConnected) {
            socketRef.current.emit("updateMessage", {
              roomId,
              messageId: messageId,
              updates: {
                pending: false
              }
            })
          }

          // Update message in Redux store to mark as not pending
          dispatch(
            sendMessage({
              sender: myAccount,
              text: currentText,
              roomId,
              messageImageHref,
              date: messageDate,
              id: messageId,
              pending: false
            })
          )
        })
        .catch((error) => {
          console.error("Failed to persist message:", error)
          // Update message in Redux store to indicate error
          dispatch(
            sendMessage({
              sender: myAccount,
              text: currentText,
              roomId,
              messageImageHref,
              date: messageDate,
              id: messageId,
              pending: false,
              error: true
            })
          )
        })
        .finally(() => {
          pendingMessagesRef.current.delete(messageId)
          clearInterval(socketRetryInterval) // Clear retry interval in any case
        })
    } catch (error) {
      console.error("Error sending message:", error)
      pendingMessagesRef.current.delete(messageId)
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
